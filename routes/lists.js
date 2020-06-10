var express = require("express");
var router = express.Router();
var List = require("../models/list");

// ============================
// LIST ROUTES
// ============================

// Index|GET - List all task lists ("/lists")
router.get("/", function (req, res) {
    List.find({}, function (err, lists) {
        if (err) {
            console.log(err);
        } else {
            res.render("lists/index", { lists: lists });
        }
    });
});

// New|GET - Show new list form ("/lists/new")
router.get("/new", function (req, res) {
    res.render("lists/new");
});

// Create|POST - Create a new list, then redirect "/lists"
router.post("/", function (req, res) {
    var name = req.body.name;
    var createDate = new Date().toLocaleString();
    var lastUpdateDate = createDate;
    var newList = { name: name, createDate: createDate, lastUpdateDate: lastUpdateDate };
    List.create(newList, function (err, createdList) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/lists"); // todo: need to redirect to the create list
        }
    });
});

// Show|GET - Show info about one specific list ("/lists/:list_id")
router.get("/:list_id", function (req, res) {
    List.findById(req.params.list_id).populate("tasks").exec(function (err, foundList) {
        if (err || !foundList) {
            console.log(err);
        } else {
            res.render("lists/show", { list: foundList });
        }
    });
});

// Edit|GET - Show edit form for specific list ("/lists/:list_id/edit")
router.get("/:list_id/edit", function (req, res) {
    List.findById(req.params.list_id, function (err, foundList) {
        if (err || !foundList) {
            console.log(err);
        } else {
            res.render("lists/edit", { list: foundList });
        }
    });
});

// Update|PUT - Update particular list, then redirect "/lists/:list_id"
router.put("/:list_id", function (req, res) {
    req.body.list.lastUpdateDate = new Date().toLocaleString();
    List.findByIdAndUpdate(req.params.list_id, req.body.list, function (err, updatedList) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/lists/" + req.params.list_id);
        }
    });
});

// Destroy|DELETE - Delete particular list, then redirect "/lists" 
router.delete("/:list_id", function (req, res) {
    List.findByIdAndRemove(req.params.list_id, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/lists");
        }
    });
});

module.exports = router;

// todo: for every "console.log(err)" add redirect action and flash message