var mongoose = require("mongoose");

var Controller = new mongoose.Schema({
    name: String,
    type: String,
    key: Number,
    devices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device"
        }
    ]
});

module.exports = mongoose.model("Controller", Controller);