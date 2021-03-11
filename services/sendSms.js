const axios = require("axios").default;


//=============================================================================
// This function  send is supoosed to send the messages to contact list of schedule
//=============================================================================

const send = async function (payload) {
  const { message, dnis } = payload;
  try {
    const result = await axios.post("http://kr8tif.lawaapp.com:1338/api", {
      dnis,
      message,
    });
    return result.data;
  } catch (err) {
    console.log("there is something wrong");
  }
};

//=============================================================================
// This function  getMsgStatus is supoosed to get  the messages detail using messageId
//=============================================================================

const getMsgStatus = async function (messageId) {
  try {
    const result = await axios.get("http://kr8tif.lawaapp.com:1338/api", {
      params: {
        messageId,
      },
    });
    return result.data;
  } catch (err) {
    console.log("there is something wrong");
  }
};

module.exports.send = send;
module.exports.getMsgStatus = getMsgStatus;