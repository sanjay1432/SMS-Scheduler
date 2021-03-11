const mongoose = require("mongoose");
const { Contact, Schedules } = require("../models/scheduleModel.js");
require("dotenv").config();

const schedulesList = [
  {
    time: "10:38",
    message: "Hello From Schedule 1",
    contacts:  [...Array(10)].map(() => Math.floor(100000000 + Math.random() * 90000000).toString()),
  },
  {
    time: "14:31",
    message: "Hello From Schedule 2",
    contacts:  [...Array(10)].map(() => Math.floor(100000000 + Math.random() * 90000000).toString()),
  },
  {
    time: "14:31",
    message: "Hello From Schedule 3",
    contacts:  [...Array(10)].map(() => Math.floor(100000000 + Math.random() * 90000000).toString()),
  },
  {
    time: "17:11",
    message: "Hello From Schedule 4",
    contacts:  [...Array(10)].map(() => Math.floor(100000000 + Math.random() * 90000000).toString()),
  },
  {
    time: "15:29",
    message: "Hello From Schedule 5",
    contacts:  [...Array(10)].map(() => Math.floor(100000000 + Math.random() * 90000000).toString()),
  },
];

mongoose.Promise = Promise;

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.4nmra.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

//=============================================================================
// Connect to the MongoDB Database
//=============================================================================
const connnect = async function () {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("database connected");
    const connection = mongoose.connection;
    await mongoose.connection.db.dropDatabase(
      console.log(`${connection.db.databaseName} database dropped.`)
    );
    return true
  } catch (err) {
    console.log("there is some error connecting db");
    return false
  }
};

//=============================================================================
// Initialize  & Seed the DB with schedules
//=============================================================================

const init = async function () {
  return await Promise.all(
    schedulesList.map(async (schedule) => {
      const contactIds = await Promise.all(
        schedule.contacts.map(async (contact) => {
          const newContact = new Contact({ number: contact });
          const saved = await newContact.save();
          return saved._id;
        })
      );
      const schecdulePayload = {
        time: schedule.time,
        message: schedule.message,
        contacts: contactIds,
      };
      const newSchedule = new Schedules(schecdulePayload);
      await newSchedule.save();
    })
  );
};
module.exports.connnect = connnect;
module.exports.init = init;
