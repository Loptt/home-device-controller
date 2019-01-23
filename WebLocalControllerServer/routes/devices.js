var express = require("express");
var router = express.Router();
var Device = require("../models/device");
var Schedule = require("../models/schedule");
var jobFunctions = require("../jobs/index");

//Index route
router.get("/devices", (req, res) => {
    Device.find({}, (err, devices) => {
        if (err) {
            console.log(err);
        } else {
            res.render("devices/index", { devices: devices });
        }
    });
});

//Add device route
router.post("/devices", (req, res) => {
    Device.create(req.body.device, (err, newDevice) => {
        if (err) {
            console.log(err);
            req.flash("error", "Error al añadir dispositivo");
            res.redirect("/devices");
        } else {
            req.flash("success", "Dispositivo añadido");
            res.redirect("/devices");
        }
    });
});

//New Form route
router.get("/devices/new", (req, res) => {
    res.render("devices/new");
});

//Show route
router.get("/devices/:id", (req, res) => {
    Device.findById(req.params.id).populate("schedules").exec((err, device) => {
        if (err) {
            console.log(err);
            res.redirect("/devices");
        } else {
            res.render("devices/show", { device: device });
        }
    });
});

//Render edit route
router.get("/devices/:id/edit", (req, res) => {
    Device.findById(req.params.id, (err, foundDevice) => {
        if (err) {
            console.log(err);
            res.redirect("/devices");
        } else {
            res.render("devices/edit", { device: foundDevice });
        }
    });
});

//Update device route
router.put("/devices/:id", (req, res) => {
    Device.findByIdAndUpdate(req.params.id, req.body.device, (err, device) => {
        if (err) {
            console.log(err);
            res.redirect("/devices");
        } else {
            jobFunctions.cancelJobs(jobs);
            jobs = jobFunctions.saveJobs();
            req.flash("success", "Dispositivo actualizado");
            res.redirect("/devices/" + req.params.id);
        }
    });
});

//Delete device route
router.delete("/devices/:id", (req, res) => {
    Device.findById(req.params.id, (err, foundDevice) => {
        if (err) {
            console.log(err);
        } else {
            var initialLength = foundDevice.schedules.length;
            foundDevice.schedules.forEach((schedule, i) => {
                Schedule.findByIdAndRemove(schedule._id, (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Removed schedule no " + i);
                    }
                    //TODO: NOT WORKING YET
                    if (i === initialLength - 1) {
                        console.log("Restarting jobs");
                        jobFunctions.cancelJobs(jobs);
                        jobs = jobFunctions.saveJobs();
                    }
                });
            });

            Device.findByIdAndRemove(req.params.id, (err) => {
                if (err) {
                    console.log(err);
                    res.redirect("/devices");
                } else {
                    req.flash("success", "Dispositivo eliminado");
                    res.redirect("/devices");
                }
            });
        }
    });
});

//Turn on device route
router.get("/devices/:id/on", (req, res) => {
    Device.findById(req.params.id, (err, device) => {
        if (err) {
            console.log(err);
            req.flash("error", "La operación no se ha podido realizar");
            res.redirect("back");
        } else {
            controller.turnOn(device.pin);
            setTimeout(() => {
                controller.turnOff(device.pin);
            }, 300000);
            req.flash("success", "Dispositivo encendido");
            res.redirect("back");
        }
    });
});

//Turn off device route
router.get("/devices/:id/off", (req, res) => {
    Device.findById(req.params.id, (err, device) => {
        if (err) {
            console.log(err);
            req.flash("error", "La operación no se ha podido realizar");
            res.redirect("back");
        } else {
            controller.turnOff(device.pin);
            req.flash("success", "Dispositivo apagado");
            res.redirect("back");
        }
    });
});

module.exports = router;