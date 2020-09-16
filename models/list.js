var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    name: String,
    description: String,
    createDate: String,
    lastUpdateDate: String,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
});

module.exports = mongoose.model("List", listSchema);