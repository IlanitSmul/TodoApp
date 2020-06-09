var express = require("express");
var router = express.Router();
var List = require("../models/list");

// ============================
// LIST ROUTES
// ============================

// Index|GET - List all task lists ("/lists")
router.get("/", function(req, res) {
    List.find({}, function(err, lists) {
        if (err) {
            console.log(err);
        } else {
            res.render("lists/index", { lists: lists });
        }
    });
});

// New|GET - Show new list form ("/lists/new")
router.get("/new", function(req, res) {
    res.render("lists/new");
});

// Create|POST - Create a new list, then redirect "/lists"
router.post("/", function(req, res) {
    var name = req.body.name;
    var creationDate = new Date().toLocaleString();
    var newList = { name: name, creationDate: creationDate };
    List.create(newList, function(err, createdList) {
        if (err) {
            console.log(err);
        } else {
            console.log(createdList);
            res.redirect("/lists"); // todo: need to redirect to the create list
        }
    });
});

// Show|GET - Show info about one specific list ("/list/:id")
router.get("/:id", function(req, res) {
    List.findById(req.params.id, function(err, foundList) {
        if (err || !foundList) {
            console.log(err);
        } else {
            res.render("lists/show", { list: foundList });
        }
    });
});

// Edit|GET - Show edit form for specific list ("/lists/:id/edit")
router.get("/:id/edit", function(req, res) {
    List.findById(req.params.id, function(err, foundList) {
        if (err || !foundList) {
            console.log(err);
        } else {
            res.render("lists/edit", { list: foundList });
        }
    });
});

// Update|PUT - Update particular list, then redirect "/lists/:id"
router.put("/:id", function(req, res) {
    List.findByIdAndUpdate(req.params.id, req.body.list, function(err, updatedList) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/lists/" + req.params.id);
        }
    });
});

// Destroy|DELETE - Delete particular list, then redirect "/lists" 
router.delete("/:id", function(req, res) {
    List.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/lists");
        }
    });
});

module.exports = router;

// todo: for every "console.log(err)" add redirect action and flash message