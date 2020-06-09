var mongoose = require("mongoose");
var List = require("./models/list");

function seedDB() {
    List.remove({}, function(err) {
        if (err) {
            console.log(err);
        }
    })
}

module.exports = seedDB;