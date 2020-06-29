var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds"),
    Task = require("./models/task")

var url = process.env.DATABASEURL || "mongodb://localhost:27017/todo_app";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
// seedDB();

// ============================
// requring routes
// ============================

var indexRoutes = require("./routes/index"),
    listRoutes = require("./routes/lists"),
    taskRoutes = require("./routes/tasks");

app.use("/", indexRoutes);
app.use("/lists", listRoutes);
app.use("/lists/:list_id/tasks", taskRoutes);

// ============================
// listen to port
// ============================

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});