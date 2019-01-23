var express = require("express");
var router = express.Router();

//LANDING ROUTE
router.get("/", (req, res) => {
    res.redirect("/controllers");
});

module.exports = router;
