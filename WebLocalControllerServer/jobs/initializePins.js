var mongoose = require("mongoose"),
    nodeSchedule = require("node-schedule"),
    Gpio = require("onoff").Gpio,
    Device = require("../models/device"),
    Schedule = require("../models/schedule");

function initializePins() {
    Device.find({}, (err, devices) => {
        if (err) {
            console.log(err);
        } else {
            devices.forEach((device) => {
                var pin = new Gpio(device.pin, "out");
                pin.writeSync(1);
            });
        }
    });
}

module.exports = initializePins;