var List = require("../models/list");
var Task = require("../models/task");

module.exports = {

    isLoggedIn: function (req, res, next) { // check if a user is current loged in
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("auth-command", "login");
        req.flash("error-type", "login");
        req.flash("error", "You must be signed in to do this action");
        return res.redirect("/");
    },

    checkUserList: function (req, res, next) { // check if the current user owns the List
        if (req.isAuthenticated()) {
            List.findById(req.params.list_id, function (err, list) {
                if (list.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error-type", "general");
                    req.flash("error", "You don't have permission to do this action");
                    return res.redirect("/");
                }
            });
        } else {
            req.flash("auth-command", "login");
            req.flash("error-type", "login");
            req.flash("error", "You must be signed in to do this action");
            return res.redirect("/");
        }
    },

}