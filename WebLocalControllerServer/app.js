var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    nodeSchedule = require("node-schedule"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    Device = require("./models/device"),
    Schedule = require("./models/schedule"),
    seedDB = require("./seeds"),
    jobFunctions = require("./jobs"),
    controller = require("./controller");

var indexRoutes = require("./routes/index"),
    deviceRoutes = require("./routes/devices"),
    scheduleRoutes = require("./routes/schedules"),
    controllerRoutes = require("./routes/controllers");

//Connect to database
var database = process.env.DCDATABASEURL || "mongodb://localhost:27017/home_device";
mongoose.connect(database, { useNewUrlParser: true }, (err) => {
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
jobs = jobFunctions.saveJobs(); //Create jobs for every schedule object
jobFunctions.initializePins(); //Set all pins to its initial state

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

//=====================
//  ROUTES
//=====================

app.use(indexRoutes);
app.use(controllerRoutes);
app.use(deviceRoutes);
app.use(scheduleRoutes);

//General route
app.get("*", (req, res) => {
    res.redirect("/devices");
});

app.listen(3000, () => {
    console.log("Rasp server started on port 3000");
});