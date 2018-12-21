var mongoose = require("mongoose"),
    nodeSchedule = require("node-schedule"),
    controller = require("../controller"),
    Device = require("../models/device"),
    Schedule = require("../models/schedule");

function createCron(hour, minute) {
    var finalMinute = Number(minute);
    var finalHour = Number(hour);

    var addedHours = Math.floor(finalMinute / 60);

    if (finalMinute > 59) {
        finalMinute = finalMinute % 60;
    }

    //console.log("Final hour:" + finalHour + " Added: " + addedHours);

    finalHour += addedHours;

    if (finalHour + addedHours > 23) {
        finalHour = (finalHour + addedHours) % 24;
    }

    //console.log( "0 " + finalMinute + " " + finalHour + " * * *");

    return "0 " + finalMinute + " " + finalHour + " * * *";
}

function saveIndJob(hour, minute, duration, dPin) {

    var jobs = [];
    var pin = Number(dPin);

    var startJob = nodeSchedule.scheduleJob(createCron(hour, minute), function (savePin) {
        console.log("JOOOB executed start with pin: " + savePin);
        controller.turnOn(savePin);
    }.bind(null, pin));

    var endJob = nodeSchedule.scheduleJob(createCron(hour, minute + duration), function (savePin) {
        console.log("JOOOB executed end with pin: " + savePin);
        controller.turnOff(savePin);
    }.bind(null, pin));

    jobs.push(startJob);
    jobs.push(endJob);

    return jobs;
}

module.exports = saveIndJob;