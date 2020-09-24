var mongoose = require("mongoose");
var List = require("./models/list");
var Task = require("./models/task");
var User = require("./models/user");

function seedDB() {
    List.remove({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log("removed lists!");
        Task.remove({}, function (err) {
            if (err) {
                console.log(err);
            }
            console.log("removed tasks!");
            User.remove({}, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log("removed users!");
            });
        });
    });
}

module.exports = seedDB;