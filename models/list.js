var mongoose = require("mongoose");

var listSchema = new mongoose.Schema({
    name: String,
    description: String,
    createDate: String,
    lastUpdateDate: String,
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
    }]
});

module.exports = mongoose.model("List", listSchema);