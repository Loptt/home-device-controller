var express = require("express");
var router = express.Router();
var Controller = require("../models/controller");
var Device = require("../models/device");
var Schedule = require("../models/schedule");
var jobFunctions = require("../jobs/index");

router.get("/controllers", (req, res) => {
    Controller.find({}, (err, controllers) => {
        if (err) {
            console.log(err);
            res.redirect("/");
        } else {
            res.render("controllers/index", { controllers: controllers });
        }
    });
});

router.get("/controllers/new", (req, res) => {
    res.render("controllers/new");
});

router.post("/controllers", (req, res) => {
    var controller = req.body.controller;
    controller.key = Math.floor(Math.random() * 100);

    Controller.create(controller, (err, newController) => {
        if (err) {
            console.log(err);
            req.flash("error", "Error al añadir controlador");
            res.redirect("/controllers");
        } else {
            req.flash("success", "Controlador añadido");
            res.redirect("/controllers");
        }
    });
});

router.get("/controllers/:id", (req, res) => {
    Controller.findById(req.params.id, (err, controller) => {
        if (err) {
            console.log(err);
            req.flash("error", "Error de base de datos");
            res.redirect("/controllers");
        } else {
            res.render("controllers/show", { controller: controller });
        }
    });
});

router.get("/controllers/:id/edit", (req, res) => {
    Controller.findById(req.params.id, (err, controller) => {
        if (err) {
            console.log(err);
            req.flash("error", "Error de base de datos");
            res.redirect("/controllers");
        } else {
            res.render("controllers/edit", { controller: controller });
        }
    });
});

router.put("/controllers/:id", (req, res) => {
    Controller.findByIdAndUpdate(req.params.id, req.body.controller, (err, newController) => {
        if (err) {
            console.log(err);
        } else {

        }
    });
});

module.exports = router;