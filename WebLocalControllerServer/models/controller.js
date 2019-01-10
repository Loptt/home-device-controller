var mongoose = require("mongoose");

var Controller = new mongoose.Schema({
    name: String,
    devices: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Device"
        }
    ]
});

module.exports = mongoose.model("Controller", Controller);