var mongoose = require("mongoose"),
    nodeSchedule = require("node-schedule"),
    Gpio = require("onoff").Gpio,
    Device = require("../models/device"),
    Schedule = require("../models/schedule");

function saveIndJob(hour, minute, duration, dPin) {

    var jobs = [];
    var cronStart = "0 " + minute + " " + hour + " * * *";
    var pin = dPin; //var pin = new Gpio(Number(dPin), "out");

    var startJob = nodeSchedule.scheduleJob(cronStart, function (savePin) {
        console.log("JOOOB executed start");
        //pin.writeSync(1);   //Turn on pin
    }.bind(null, pin));

    var cronEnd = "0 " + (minute + duration) + " " + hour + " * * *";
    var endJob = nodeSchedule.scheduleJob(cronEnd, function (savePin) {
        //pin.writeSync(0);   //Turn off pin
        console.log("JOOOB executed end");
    }.bind(null, pin));

    jobs.push(startJob);
    jobs.push(endJob);

    return jobs;
}

function saveJobs() {
    var jobs = [];
    Device.find({}).populate("schedules").exec((err, devices) => {
        if (err) {
            console.log(err);
        } else {
            devices.forEach((device) => {
                device.schedules.forEach((schedule) => {
                    var cronStart = "0 " + schedule.start.minute + " " + schedule.start.hour + " * * *";
                    var pin = device.pin; //var pin = new Gpio(Number(device.pin), "out");

                    var startJob = nodeSchedule.scheduleJob(cronStart, function (savePin) {
                        console.log("JOOOB executed start, pin: " + savePin);
                        //pin.writeSync(1);   //Turn on pin
                    }.bind(null, pin));

                    var cronEnd = "0 " + (schedule.start.minute + schedule.duration) + " " + schedule.start.hour + " * * *";
                    var endJob = nodeSchedule.scheduleJob(cronEnd, function (savePin) {
                        //pin.writeSync(0);   //Turn off pin
                        console.log("JOOOB executed end, pin: " + savePin);
                    }.bind(null, pin));

                    jobs.push(startJob);
                    jobs.push(endJob);
                });
            });
        }
    });

    return jobs;
}

module.exports = saveJobs;