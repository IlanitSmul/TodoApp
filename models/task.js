var mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
    title: String,
    status: {
        type: String,
        enum: ["Next Up", "In Progress", "Complete"],
        default: "Next Up",
    },
    priority: {
        type: String,
        enum: ["High", "Medium", "Low"],
    },
    dueDate: String,
    description: String,
});

module.exports = mongoose.model("Task", taskSchema);