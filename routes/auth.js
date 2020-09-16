var express = require("express");
var router = express.Router();
var passport = require("passport");
var Task = require("../models/task");
var User = require("../models/user");

// ============================
// AUTH ROUTE
// ============================

// register|POST - Handle register (sign up) logic, then redirect "/lists"
router.post("/register", function (req, res) {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash("auth-command", "register");
            req.flash("error-type", "register");
            req.flash("error", err.message);
            res.redirect("/");
        }
        passport.authenticate("local")(req, res, function () {
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