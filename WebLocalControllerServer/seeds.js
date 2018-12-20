var mongoose = require("mongoose");
var Device = require("./models/device");
var Schedule = require("./models/schedule");

var data = [
    {
        name: "Riego 1",
        pin: 2
    },
    {
        name: "Riego 2",
        pin: 3
    }
];

function seedDB() {
    Device.remove({}, (err) => {
        if (err) {
            console.log(err);
        } else {
            Schedule.remove({}, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    data.forEach((seed) => {
                        Device.create(seed, (err, newDevice) => {
                            if (err) {
                                console.log(err) 
                            } else {
                                var schedule = {
                                    start: {
                                        hour: 12,
                                        minute: 54
                                    },
                                    duration: 1
                                };
                                Schedule.create(schedule, (err, newSchedule) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        newDevice.schedules.push(newSchedule);
                                        newDevice.save();
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
    });
}

module.exports = seedDB;