var mongoose = require("mongoose"),
    nodeSchedule = require("node-schedule"),
    Gpio = require("onoff").Gpio,
    Device = require("../models/device"),
    Schedule = require("../models/schedule");
    saveIndJob = require("./saveIndJob");

function saveJobs() {
    var jobs = [];
    Device.find({}).populate("schedules").exec((err, devices) => {
        if (err) {
            console.log(err);
        } else {
            devices.forEach((device) => {
                device.schedules.forEach((schedule) => {
                    var pin = device.pin; //var pin = new Gpio(Number(device.pin), "out");
                    Array.prototype.push.apply(jobs, 
                        saveIndJob(schedule.start.hour, schedule.start.minute, schedule.duration, pin));
                });
            });
        }
    });

    return jobs;
}

module.exports = saveJobs;