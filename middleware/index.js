var List = require("../models/list");
var Task = require("../models/task");

module.exports = {

    isLoggedIn: function (req, res, next) { // todo: use this function in the routes
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("auth-command", "login");
        req.flash("error-type", "login");
        req.flash("error", "You must be signed in to do this action");
        return res.redirect("/");
    },

}