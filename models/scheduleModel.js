const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var contactSchema = new Schema({
    number: String,
    msgId: {type: String,default: null},
    msgStatus: {type: String, enum: ['ACCEPTED', 'DELIVRD', 'UNDELIV',"UNKNOWN"], default: 'UNKNOWN'},
    deliveryTime:{type: Date,default: null}
});
module.exports.Contact = mongoose.model('Contact', contactSchema) 

var scheduleModelSchema = new Schema({
    time: String,
    message: String,
    contacts: [{type: mongoose.Schema.Types.ObjectId, ref: 'Contact'}]
});

// Compile model from schema
module.exports.Schedules  = mongoose.model("schedules", scheduleModelSchema);
