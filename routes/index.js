var express = require("express");
var router = express.Router();
var Task = require("../models/task");

// ============================
// ROOT ROUTE
// ============================

// root route
router.get("/", function(req, res) {
    res.render("landing");
});

module.exports = router;