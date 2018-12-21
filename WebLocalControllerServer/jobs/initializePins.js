var mongoose = require("mongoose"),
    nodeSchedule = require("node-schedule"),
    controller = require("../controller"),
    Device = require("../models/device"),
    Schedule = require("../models/schedule");

function initializePins() {
    Device.find({}, (err, devices) => {
        if (err) {
            console.log(err);
        } else {
            devices.forEach((device) => {
                console.log("Turning off " + device.pin);
                controller.turnOff(device.pin);
            });
        }
    });
}

module.exports = initializePins;