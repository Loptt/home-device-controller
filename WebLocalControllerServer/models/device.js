var mongoose = require("mongoose");

var Device = new mongoose.Schema({
    name: String,
    pin: Number,
    schedules: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Schedule"
        }
    ]
});

module.exports = mongoose.model("Device", Device);