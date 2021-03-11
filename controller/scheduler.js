const { Schedules, Contact } = require("../models/scheduleModel.js");
const cronSchedule = require("node-schedule");
const { send, getMsgStatus } = require("../services/sendSms");

//=============================================================================
// This function  getSchedules is supoosed to get all the schedule 
// and there contacts who's message status is not DELIVRD
//=============================================================================
const getSchedules = async function () {
  return await Schedules.find().populate({
    path: "contacts",
    match: { msgStatus: {$ne: "DELIVRD"} }
  });
};


//=============================================================================
// This function  updateContactsWithMsgDetail is supoosed to update the contact schema 
// with there message status after sending in DB
//=============================================================================


const updateContactsWithMsgDetail = async function(data, msg){

   await Promise.all(data.map(async (message)=>{
    const {dnis,message_id} =  message;
    const {status, delivery_time} =  await getMsgStatus(message_id);

    if(status !== "DELIVRD"){
      //try to send message again
      tryAgain(message, msg)
    }else {
      console.log({dnis, status, delivery_time})
      await Contact.updateOne({number: dnis},{msgStatus: status, deliveryTime: delivery_time, msgId: message_id});
    }
    
  }))

  return

}


//=============================================================================
// This function  tryAgain is supoosed run recursively until 
// the message is not delivered correctly
//=============================================================================


const tryAgain =  async function( msgResInfo, msg, count = 0){
  
      const {dnis} =  msgResInfo;
    const {message_id} = await send({ message:msg, dnis });
    const {status, delivery_time} =  await getMsgStatus(message_id);
    
   
    if(status!== "DELIVRD" ) {
      tryAgain(msgResInfo, msg, count+1)
     
    }else {
      console.log({dnis, status, delivery_time})
      return  await Contact.updateOne({number: dnis},{msgStatus: status, deliveryTime: delivery_time, msgId: message_id});
    }
   

}


//=============================================================================
// This function  initializeSchedules is supoosed get the schedules and run on schedule 
// according to there time
//=============================================================================


const initializeSchedules = async function () {
  const schedules = await getSchedules();
  await Promise.all(schedules.map(async (schedule) => {
    const { message, contacts, time } = schedule;
    //Set schedule according to given time
    const splitTime =  time.split(":")
    const hour = splitTime[0]
    const minute =  splitTime[1]

    cronSchedule.scheduleJob({hour, minute},  function(){
      sendMsgToContacts(message, contacts);
    });

  }));

};


//=============================================================================
// This function  sendMsgToContacts is actually sending the messages to the contacts 
// and calling the updateContactsWithMsgDetail function after getting the response
//=============================================================================

const sendMsgToContacts = async function (message, contacts) {
  const dnisList = contacts.map((contact) => contact.number);

  const dnis = dnisList.toString();
  try{
    const result = await send({ message, dnis });

    updateContactsWithMsgDetail(result, message)     
   
  } catch(err) {
     console.log(err)
  }
 
};

module.exports.initializeSchedules = initializeSchedules;
