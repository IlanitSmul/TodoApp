var express = require("express");
var router = express.Router();
var List = require("../models/list");
var Task = require("../models/task");
var middleware = require("../middleware");
const { version } = require("mongoose");
var mongoose = require('mongoose');

// ============================
// LIST ROUTES
// ============================

// edit name | PATCH - Change name of list
router.patch("/:list_id/update_name", middleware.checkUserList, function (req, res) {
    List.findByIdAndUpdate(req.params.list_id, { 'name': req.body.list_name }, { new: true }, function (err, updatedList) {
        if (err) {
            console.log(err);
        } else {
            res.sendStatus(200);
        }
    });
});

// ============================
// LIST ROUTES: CRUD/REST
// ============================

function getListsForUser(req, res) {
    List.find({ 'author.id': req.user._id }) // pass only the lists that the user owns:
        .populate("tasks")
        .exec(function (err, lists) {
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
                res.render("lists/index", { lists: lists });
            }
        });
}

function getListsForGuest(req, res) {
    // tasks:
    var task_1_1 = new Task({
        title: "Cupcake ipsum dolor sit amet candy pie croissant caramels",
        status: "Next Up",
        priority: "High",
        dueDate: "2020-02-20",
        description: "Dessert bear claw donut pudding cupcake topping candy. Chocolate bar halvah dessert halvah cake. Candy pastry muffin carrot cake. Brownie cake tootsie roll jelly-o chocolate cake cotton candy chocolate. Pudding liquorice bear claw cake powder biscuit bear claw. Candy canes fruitcake candy gummies cotton candy. Sweet roll tootsie roll candy canes jelly lemon drops. Bonbon brownie pie liquorice marzipan cake chupa chups brownie.",
    });
    var task_1_2 = new Task({
        title: "Pudding liquorice macaroon gummies biscuit cotton candy.",
        status: "Next Up",
        priority: "Low",
        dueDate: "",
        description: "Jujubes tart wafer croissant gummies caramels. Jelly apple pie cake cupcake. Sugar plum marshmallow croissant sweet roll carrot cake lollipop.",
    });
    var task_1_3 = new Task({
        title: "Wafer chocolate cake sesame snaps cake carrot cake bear claw. Ice cream chupa chups sesame snaps cookie gummies ice cream powder muffin",
        status: "Next Up",
        priority: "Low",
        dueDate: "2020-10-15",
        description: "Jelly-o icing carrot cake pastry gingerbread candy canes chocolate cake tiramisu donut.",
    });
    var task_1_4 = new Task({
        title: "Pastry tiramisu powder dessert lemon drops.",
        status: "In Progress",
        priority: "Low",
        dueDate: "",
        description: "Caramels sugar plum donut chupa chups jelly beans sweet candy. Danish sesame snaps gingerbread apple pie oat cake. Sesame snaps jelly beans sugar plum.",
    });
    var task_1_5 = new Task({
        title: "Caramels sweet oat cake bear claw lollipop.",
        status: "In Progress",
        priority: "Medium",
        dueDate: "2021-02-01",
        description: "",
    });
    var task_1_6 = new Task({
        title: "Donut chocolate cake cake bonbon lemon drops cake soufflé pudding dessert.",
        status: "In Progress",
        priority: "High",
        dueDate: "2020-04-02",
        description: "",
    });
    var task_1_7 = new Task({
        title: "Cake bear claw caramels croissant oat cake tootsie roll. Powder brownie pie cake. ",
        status: "In Progress",
        priority: "Medium",
        dueDate: "",
        description: "Donut pudding cotton candy bear claw lollipop. Dessert sweet bonbon.",
    });
    var task_1_8 = new Task({
        title: "Chupa chups jujubes halvah",
        status: "Complete",
        priority: "Medium",
        dueDate: "2020-05-15",
        description: "",
    });
    var task_1_9 = new Task({
        title: "Marshmallow cookie chocolate cake jujubes tiramisu marshmallow apple pie.",
        status: "Complete",
        priority: "High",
        dueDate: "2022-08-17",
        description: "Fruitcake cheesecake gummies muffin tiramisu cheesecake cake. Marzipan liquorice tiramisu brownie tiramisu wafer macaroon bonbon powder. Biscuit biscuit cake macaroon cake tart oat cake candy icing. ",
    });
    var tasks_1 = [task_1_1, task_1_2, task_1_3, task_1_4, task_1_5, task_1_6, task_1_7, task_1_8, task_1_9];

    task_2_1 = new Task(task_1_9);
    task_2_2 = new Task(task_1_1);
    task_2_3 = new Task(task_1_5);
    task_2_4 = new Task(task_1_3);
    task_2_5 = new Task(task_1_7);
    task_2_6 = new Task(task_1_8);
    task_2_7 = new Task(task_1_2);
    var tasks_2 = [task_2_1, task_2_2, task_2_3, task_2_4, task_2_5, task_2_6, task_2_7];
    tasks_2.forEach(element => element._id = new mongoose.Types.ObjectId());

    task_3_1 = new Task(task_1_5);
    task_3_2 = new Task(task_1_6);
    task_3_3 = new Task(task_1_3);
    task_3_4 = new Task(task_1_5);
    task_3_5 = new Task(task_1_2);
    task_3_6 = new Task(task_1_9);
    task_3_7 = new Task(task_1_4);
    task_3_8 = new Task(task_1_8);
    task_3_9 = new Task(task_1_1);
    task_3_10 = new Task(task_1_7);
    task_3_11 = new Task(task_1_5);
    var tasks_3 = [task_3_1, task_3_2, task_3_3, task_3_4, task_3_5, task_3_6, task_3_7, task_3_8, task_3_9, task_3_10, task_3_11];
    tasks_3.forEach(element => element._id = new mongoose.Types.ObjectId());

    task_5_1 = new Task(task_1_8);
    task_5_2 = new Task(task_1_9);
    var tasks_5 = [task_5_1, task_5_2];
    tasks_5.forEach(element => element._id = new mongoose.Types.ObjectId());

    // list1:
    tasks_1.forEach(element => element.save());
    const list1 = {
        name: "My #1 list",
        description: "This is the description of my #1 list.",
        author: { id: req.user._id, username: req.user.username },
        tasks: tasks_1.map(function (element) { return element._id; })
    };

    // list2:
    tasks_2.forEach(element => element.save());
    const list2 = {
        name: "My #2 list: List with a much longer name and description",
        description: "This is my second list. This list contains tasks of various types: some have been completed and some have not. Many of them have high priority.",
        author: { id: req.user._id, username: req.user.username },
        tasks: tasks_2.map(function (element) { return element._id; })
    };

    // list3:
    tasks_3.forEach(element => element.save());
    const list3 = {
        name: "My #3 list, without description",
        description: "",
        author: { id: req.user._id, username: req.user.username },
        tasks: tasks_3.map(function (element) { return element._id; })
    };

    // list4:
    const list4 = {
        name: "My #4 list",
        description: "This is an empty list.",
        author: { id: req.user._id, username: req.user.username },
        tasks: []
    };

    // list5:
    tasks_5.forEach(element => element.save());
    const list5 = {
        name: "My #5 and last list",
        description: "This is almost an empty list.",
        author: { id: req.user._id, username: req.user.username },
        tasks: tasks_5.map(function (element) { return element._id; })
    };

    List.insertMany([list1, list2, list3, list4, list5], function (err) {
        if (err) {
            console.log(err);
        }
        List.find({ 'author.id': req.user._id }) // pass only the lists that the user owns:
            .populate("tasks")
            .exec(function (err, lists) {
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
                    res.render("lists/index", { lists: lists });
                }
            });
    });
}

// Index|GET - List all task lists ("/lists")
router.get("/", middleware.isLoggedIn, function (req, res) {
    if (res.locals.demo == "false") {
        return getListsForUser(req, res);
    }
    if (res.locals.demo == "true") {
        return getListsForGuest(req, res);
    }
    return getListsForUser(req, res);
});

// New|GET - Show new list form ("/lists/new")
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("lists/new");
});

// Create|POST - Create a new list, then redirect "/lists/:list_id"
router.post("/", middleware.isLoggedIn, function (req, res) {
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
router.get("/:list_id", middleware.checkUserList, function (req, res) {
    List.findById(req.params.list_id).populate("tasks").exec(function (err, foundList) {
        if (err || !foundList) {
            console.log(err);
        } else {
            res.render("lists/show", { list: foundList });
        }
    });
});

// Edit|GET - Show edit form for specific list ("/lists/:list_id/edit") 
router.get("/:list_id/edit", middleware.checkUserList, function (req, res) {
    List.findById(req.params.list_id, function (err, foundList) {
        if (err || !foundList) {
            console.log(err);
        } else {
            res.render("lists/edit", { list: foundList });
        }
    });
});

// Update|PUT - Update particular list, then redirect "/lists/:list_id"
router.put("/:list_id", middleware.checkUserList, function (req, res) {
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
router.delete("/:list_id", middleware.checkUserList, function (req, res) {
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