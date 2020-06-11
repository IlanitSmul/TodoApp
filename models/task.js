var mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
    title: String,
    status: {
        type: String,
        enum: ["Next Up", "In Progress", "Complete"],
        default: "Next Up"
    },
    dueDate: String,
    description: String,
});

module.exports = mongoose.model("Task", taskSchema);