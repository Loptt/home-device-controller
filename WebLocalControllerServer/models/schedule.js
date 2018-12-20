var mongoose = require("mongoose");
var nodeSchedule = require("node-schedule");

var Schedule = new mongoose.Schema({
    start: {
        hour: Number,
        minute: Number
    },
    duration: Number
});

module.exports = mongoose.model("Schedule", Schedule);