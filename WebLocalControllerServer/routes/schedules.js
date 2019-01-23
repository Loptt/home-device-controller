var express = require("express");
var router = express.Router();
var Device = require("../models/device");
var Schedule = require("../models/schedule");
var jobFunctions = require("../jobs/index");

//New form route
router.get("/devices/:id/schedules/new", (req, res) => {
    Device.findById(req.params.id, (err, foundDevice) => {
        if (err) {
            console.log(err);
        } else {
            res.render("schedules/new", {device: foundDevice});
        }
    });
});


//Add schedule route
router.post("/devices/:id/schedules", (req, res) => {
    Device.findById(req.params.id, (err, foundDevice) => {
        if (err) {
            console.log(err);
        } else {
            var s = {
                start: {
                    hour: req.body.hour,
                    minute: req.body.minute
                },
                duration: req.body.duration
            }
            Schedule.create(s, (err, newSchedule) => {
                if (err) {
                    console.log(err);
                } else {
                    //Concatenate new jobs to older job array
                    Array.prototype.push.apply(jobs, 
                        jobFunctions.saveIndJob(newSchedule.start.hour, newSchedule.start.minute,
                        newSchedule.duration, foundDevice.pin));

                    foundDevice.schedules.push(newSchedule);
                    foundDevice.save();
                    req.flash("success", "Horario añadido");
                    res.redirect("/devices/" + foundDevice._id);
                }
            });
        }
    });
});

//Render edit route
router.get("/devices/:id/schedules/:schedule_id/edit", (req, res) => {
    Schedule.findById(req.params.schedule_id, (err, foundSchedule) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            res.render("schedules/edit", {device_id: req.params.id, schedule: foundSchedule});
        }
    });
});

//Update schedule route
router.put("/devices/:id/schedules/:schedule_id", (req, res) => {
    var s = {
        start: {
            hour: req.body.hour,
            minute: req.body.minute
        },
        duration: req.body.duration
    }
    Schedule.findByIdAndUpdate(req.params.schedule_id, s, (err, updatedSchedule) => {
        if (err) {
            console.log(err);
            res.redirect("back");
        } else {
            jobFunctions.cancelJobs(jobs);
            jobs = jobFunctions.saveJobs();
            req.flash("success", "Horario actualizado");
            res.redirect("/devices/" + req.params.id);
        }
    });
});

//Delete schedule route
router.delete("/devices/:id/schedules/:schedule_id", (req, res) => {
    Device.find({}, (err, devices) => {
        if (err) {
            console.log(err);
        } else {
            devices.forEach((device) => {
                device.schedules.forEach((schedule, i) => {
                    if (schedule._id.equals(req.params.schedule_id)) {
                        device.schedules.splice(i, 1);
                    }
                });
                device.save();
            });
            Schedule.findByIdAndRemove(req.params.schedule_id, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    jobFunctions.cancelJobs(jobs);
                    jobs = jobFunctions.saveJobs();
                    req.flash("success", "Horario eliminado");
                    res.redirect("/devices/" + req.params.id);  
                }
            });
        }
    });
});

module.exports = router;