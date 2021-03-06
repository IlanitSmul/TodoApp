var express = require("express");
var router = express.Router({ mergeParams: true });
var List = require("../models/list");
var Task = require("../models/task");
var middleware = require("../middleware");

// ============================
// TASK ROUTES
// ============================

// add task | POST - Create a new task, then render "tasks/new" with the "default_status"
router.post("/new_task", middleware.checkUserList, function (req, res) {
    List.findById(req.params.list_id, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("tasks/new", { list: list, default_status: req.body.status });
        }
    })
});

// edit status | PATCH - Change status of task
router.patch("/:task_id/change_status", middleware.checkUserList, function (req, res) {
    Task.findByIdAndUpdate(req.params.task_id, { 'status': req.body.status }, { new: true }, function (err, updatedTask) {
        if (err) {
            console.log(err);
        } else {
            res.sendStatus(200);
        }
    });
});

// ============================
// TASK ROUTES: CRUD/REST
// ============================

// Index|GET - List all task lists ("/lists") --> NOT RELEVANT

// New|GET - Show new task form ("/lists/:list_id/tasks/new")
router.get("/new", middleware.checkUserList, function (req, res) {
    List.findById(req.params.list_id, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            res.render("tasks/new", { list: list });
        }
    })
});

// Create|POST - Create a new task, then redirect "/lists/:list_id/tasks/task_id"
router.post("/", middleware.checkUserList, function (req, res) {
    List.findById(req.params.list_id, function (err, list) {
        if (err) {
            console.log(err);
        } else {
            Task.create(req.body.task, function (err, task) {
                if (err) {
                    console.log(err);
                } else {
                    task.save();
                    list.tasks.push(task);
                    list.save();
                    res.redirect("/lists/" + list._id + "/tasks/" + task._id);
                }
            });
        }
    });
});

// Show|GET - Show info about one specific task ("/lists/:list_id/tasks/:task_id")
router.get("/:task_id", middleware.checkUserList, function (req, res) {
    List.findById(req.params.list_id).populate("tasks").exec(function (err, list) {
        if (err || !list) {
            console.log(err);
        }
        Task.findById(req.params.task_id, function (err, task) {
            if (err) {
                console.log(err);
            } else {
                res.render("tasks/show", { list: list, task: task });
            }
        });
    });
});

// Edit|GET - Show edit form for specific task ("/lists/:list_id/tasks/:task_id/edit")
router.get("/:task_id/edit", middleware.checkUserList, function (req, res) {
    List.findById(req.params.list_id, function (err, list) {
        if (err || !list) {
            console.log(err);
        }
        Task.findById(req.params.task_id, function (err, task) {
            if (err) {
                console.log(err);
            } else {
                res.render("tasks/edit", { list: list, task: task });
            }
        });
    })
});

// Update|PUT - Update particular task, then redirect "/lists/:list_id/tasks/:task_id"
router.put("/:task_id", middleware.checkUserList, function (req, res) {
    Task.findByIdAndUpdate(req.params.task_id, req.body.task, { new: true }, function (err, updatedTask) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/lists/" + req.params.list_id + "/tasks/" + req.params.task_id);
        }
    });
});

// Destroy|DELETE - Delete particular task, then redirect "/lists/:list_id" 
router.delete("/:task_id", middleware.checkUserList, function (req, res) {
    Task.findByIdAndRemove(req.params.task_id, function (err) {
        if (err) {
            console.log(err);
        } else {
            List.findByIdAndUpdate(req.params.list_id, { $pull: { "tasks": req.params.task_id } }, function (err) {
                if (err) {
                    console.log(err);
                }
            });
            res.redirect("/lists/" + req.params.list_id);
        }
    });
});

module.exports = router;