var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    seedDB = require("./seeds"),
    User = require("./models/user");

var url = process.env.DATABASEURL || "mongodb://localhost:27017/todo_app";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true });

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

// ============================
// passport configuration
// ============================

app.use(require("express-session")({
    secret: "my secret!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ============================
// middleware to each view in the app
// ============================

app.use(function (req, res, next) {
    res.locals.currentUser = req.user; // the user that connent to the system currently
    res.locals.demo = req.flash('demo'); // true - the current user is guest, false - the current user is registered to the app
    res.locals.success = req.flash('success'); // "success" flash alerts
    res.locals.error = req.flash('error'); // "error" flash alerts
    res.locals.errorType = req.flash('error-type'); // type of a error flash alert: login / register / general
    res.locals.authCommand = req.flash('auth-command'); // the require authentication command in landing page: login / register / not-define
    next();
});

// ============================
// requring routes
// ============================

var indexRoutes = require("./routes/index"),
    authRoutes = require("./routes/auth"),
    listRoutes = require("./routes/lists"),
    taskRoutes = require("./routes/tasks");

app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/lists", listRoutes);
app.use("/lists/:list_id/tasks", taskRoutes);

// ============================
// listen to port
// ============================

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server Has Started!");
});