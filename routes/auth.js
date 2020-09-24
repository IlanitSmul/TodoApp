var express = require("express");
var router = express.Router();
var passport = require("passport");
var Task = require("../models/task");
var User = require("../models/user");
const { version } = require("mongoose");

// ============================
// AUTH ROUTE
// ============================

// guest|POST - Handle register guest, then redirect pre-made "/lists" // todo: add flash messages in case of error
router.post("/guest", function (req, res) {
    User.countDocuments({}, function (err, numOfUsers) {
        if (err) {
            console.log(err);
            return res.redirect("/");
        }
        else {
            // username = passport = number of registerd users concats with 'Guest-'
            var guestId = "Guest-".concat(numOfUsers);
            req.body.username = guestId;
            req.body.password = guestId;
            var newUser = new User({ username: req.body.username });
            User.register(newUser, req.body.password, function (err, user) {
                if (err) {
                    console.log(err);
                    return res.redirect("/");
                }
                passport.authenticate("local")(req, res, function () {
                    req.flash("demo", "true");
                    res.redirect("/lists");
                });
            });
        }
    });
});

// register|POST - Handle register (sign up) logic, then redirect "/lists"
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("auth-command", "register");
            req.flash("error-type", "register");
            req.flash("error", err.message);
            return res.redirect("/");
        }
        passport.authenticate("local")(req, res, function () {
            req.flash("demo", "false");
            res.redirect("/lists");
        });
    });
});

// login|POST - Handle login logic, then redirect "/lists"
router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, user, info) {
        if (err) {
            req.flash("auth-command", "login");
            req.flash("error-type", "login");
            req.flash("error", err.message);
            return next(err);
        }
        if (!user) {
            req.flash("auth-command", "login");
            req.flash("error-type", "login");
            req.flash("error", info.message);
            return res.redirect("/");
        }
        req.logIn(user, function (err) {
            if (err) {
                req.flash("auth-command", "login");
                req.flash("error-type", "login");
                req.flash("error", err.message);
                return next(err);
            }
            req.flash("demo", "false");
            return res.redirect("/lists");
        })
    })(req, res, next)
})

// logout|GET - Show logout form ("/logout")
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;