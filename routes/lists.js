var express = require("express");
var router = express.Router();
var List = require("../models/list");
var Task = require("../models/task");
var middleware = require("../middleware");
const { version } = require("mongoose");

// ============================
// LIST ROUTES
// ============================

// edit name | PATCH - Change name of list
router.patch("/:list_id/update_name", function (req, res) {
    List.findByIdAndUpdate(req.params.list_id, { 'name': req.body.list_name }, { new: true }, function (err, updatedList) {
        if (err) {
            console.log(err);
        } else {
            console.log(updatedList); // dlog
            res.sendStatus(200);
        }
    });
});

// ============================
// LIST ROUTES: CRUD/REST
// ============================

// Index|GET - List all task lists ("/lists")
router.get("/", middleware.isLoggedIn, function (req, res) {
    List.find().populate("tasks").exec(function (err, lists) {
        if (err) {
            console.log(err);
        } else {
            lists.forEach(function (l) {
                l.nextUp = 0;
                l.inProgress = 0;
                l.complete = 0;
                l.tasks.forEach(function (t) {
                    switch (t.status) {
                        case 'Next Up':
                            l.nextUp += 1;
                            break;
                        case 'In Progress':
                            l.inProgress += 1;
                            break;
                        case 'Complete':
                            l.complete += 1;
                            break;
                    }
                });
            });
            // pass only the lists that the user owns:
            res.render("lists/index", { lists: lists.filter(list => list.author.id !== undefined && list.author.id.equals(req.user._id)) });
        }
    });
});

// New|GET - Show new list form ("/lists/new")
router.get("/new", function (req, res) {
    res.render("lists/new");
});

// Create|POST - Create a new list, then redirect "/lists/:list_id"
router.post("/", function (req, res) {
    var name = req.body.list.name;
    var description = req.body.list.description;
    var createDate = new Date().toLocaleString();
    var lastUpdateDate = createDate;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newList = { name: name, description: description, createDate: createDate, lastUpdateDate: lastUpdateDate, author: author };
    List.create(newList, function (err, createdList) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/lists/" + createdList._id);
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
    List.findByIdAndRemove(req.params.list_id, function (err, foundList) {
        if (err) {
            console.log(err);
        } else {
            foundList.tasks.forEach(task_id =>
                Task.findByIdAndRemove(task_id, function (err) {
                    if (err) {
                        console.log(err);
                    }
                })
            );
            res.redirect("/lists");
        }
    });
});

module.exports = router;

// todo: for every "console.log(err)" add redirect action and flash message