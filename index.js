const express = require("express");
const app = express();
const db = require("./config/db");
const scheduleRoute = require("./routes/schedule");
const scheduleController = require("./controller/scheduler");
const  bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


app.use("/schedule", scheduleRoute);

app.get("/", (req, res) => {
  res.send("SMS Scheduler application!");
});

const init = async function () {

  await db.connnect();
  await db.init();
  await scheduleController.initializeSchedules();

};
app.listen(8000, () => {
  init();
  console.log("SMS-Scheduler app listening on port 8000!");
});
