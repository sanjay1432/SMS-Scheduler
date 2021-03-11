const express = require("express");
const router = express.Router();
const { Schedules } = require("../models/scheduleModel.js");




//=============================================================================
// This is the route to get the schedules with there contacts & message detail 
// Request Type: GET
// http://localhost:8000/schedule
// http://localhost:8000/schedule/{perPage}/{page}  
// perPage = 1,2,4 etc.
// page = 0,1,2,4 etc.
//=============================================================================



router.get("/:perPage?/:page?", async (req, res) => {
  const perPage = parseInt(req.params.perPage);
  const page = Math.max(0, parseInt(req.params.page));
  try {
    const scheduleCount = await Schedules.countDocuments();
    const schedules = await Schedules.find()
      .limit(perPage)
      .skip(page * perPage)
      .populate({
        path: "contacts"
      });
    res.send({
      schedules,
      scheduleCount,
    });
  } catch (err) {
    res.status(500).send(err);
  }
});


//=============================================================================
// This is the route to get the schedule with there contacts & message detail by using the schedule Id 
// Request Type: POST
// http://localhost:8000/schedule/sms
// payload: {
//   "id":"60488f28b9df938074cd6267"
// }
//=============================================================================



router.post("/sms", async (req, res) => {
  const {id} = req.body;
  if(!id)  res.status(404).send('schedule Id not found!');
  try {
    const schedules = await Schedules.findOne({ _id: id }).populate(
      "contacts"
    );
    res.send(schedules);
  } catch (err) {
    res.status(500).send('Please pass valid schedule Id!');
  }
});

module.exports = router;
