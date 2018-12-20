var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    nodeSchedule = require("node-schedule"),
    methodOverride = require("method-override"),
    Gpio = require("onoff").Gpio,
    flash = require("connect-flash")
    Device = require("./models/device"),
    Schedule = require("./models/schedule"),
    seedDB = require("./seeds"),
    jobFunctions = require("./jobs");

//Connect to database
console.log(process.env.DCDATABASEURL);
mongoose.connect(process.env.DCDATABASEURL, { useNewUrlParser: true }, (err) => {
    if (err) {
        console.log("DATABASE ERROR");
        console.log(err);
        return;
    }
    console.log("Database connected!");
});

//GLOBAL CONSTANTS
ONSTATE = 0;
OFFSTATE = 1;

//====================
//  SETUP FUNCTIONS
//====================

//seedDB();
var jobs = jobFunctions.saveJobs(); //Create jobs for every schedule object
//jobFunctions.initializePins(); //Set all pins to its initial state

app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "Toby is the best and cutest dog",
    resave: false,
    saveUninitialized: false
}));


app.use((req, res, next) => {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//LANDING ROUTE
app.get("/", (req, res) => {
    res.redirect("/devices");
});

//========================
// DEVICES ROUTES
//========================

//Index route
app.get("/devices", (req, res) => {
    Device.find({}, (err, devices) => {
        if (err) {
            console.log(err);
        } else {
            res.render("devices/index", { devices: devices });
        }
    });
});

//Add device route
app.post("/devices", (req, res) => {
    Device.create(req.body.device, (err, newDevice) => {
        if (err) {
            console.log(err);
        } else {
            req.flash("success", "Dispositivo añadido");
            res.redirect("/devices");
        }
    });
});

//New Form route
app.get("/devices/new", (req, res) => {
    res.render("devices/new");
});

//Show route
app.get("/devices/:id", (req, res) => {
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
app.get("/devices/:id/edit", (req, res) => {
    Device.findById(req.params.id, (err, foundDevice) => {
        if (err) {
            console.log(err);
            res.redirect("/devices");
        } else {
            res.render("devices/edit", {device: foundDevice});
        }
    });
});

//Update device route
app.put("/devices/:id", (req, res) => {
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
app.delete("/devices/:id", (req, res) => {
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
                    if (i === initialLength-1) {
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

app.get("/devices/:id/on", (req, res) => {
    Device.findById(req.params.id, (err, device) => {
        if (err) {
            console.log(err);
            req.flash("error", "La operación no se ha podido realizar");
            res.redirect("back");
        } else {
            var pin = new Gpio(device.pin, "out");
            pin.writeSync(ONSTATE);
            setTimeout(() => {
                pin.writeSync(OFFSTATE);
            }, 300000);
            req.flash("success", "Dispositivo encendido");
            res.redirect("back");
        }
    });
});

app.get("/devices/:id/off", (req, res) => {
    Device.findById(req.params.id, (err, device) => {
        if (err) {
            console.log(err);
            req.flash("error", "La operación no se ha podido realizar");
            res.redirect("back");
        } else {
            var pin = new Gpio(device.pin, "out");
            pin.writeSync(OFFSTATE);
            req.flash("success", "Dispositivo apagado");
            res.redirect("back");
        }
    });
});

//========================
// SCHEDULE ROUTES
//========================

//New form route
app.get("/devices/:id/schedules/new", (req, res) => {
    Device.findById(req.params.id, (err, foundDevice) => {
        if (err) {
            console.log(err);
        } else {
            res.render("schedules/new", {device: foundDevice});
        }
    });
});


//Add schedule route
app.post("/devices/:id/schedules", (req, res) => {
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
app.get("/devices/:id/schedules/:schedule_id/edit", (req, res) => {
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
app.put("/devices/:id/schedules/:schedule_id", (req, res) => {
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

app.delete("/devices/:id/schedules/:schedule_id", (req, res) => {
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

//General route
app.get("*", (req, res) => {
    res.redirect("/devices");
});

app.listen(3000, () => {
    console.log("Rasp server started on port 3000");
});