// ==========================
// LOGIN CREATE ROUTE
// ==========================

var passport = require("passport");

var createRoute = function(req, res) {
    passport.authenticate("local", function(err, user, info) {
        if (err) {
            console.log(err);
            req.flash("errorMessage", err.message);
            return res.redirect("/login");
        } else if (!user) {
            req.flash("errorMessage", "Incorrect username or password");
            return res.redirect("/login");
        } else {
            req.logIn(user, function(err) { //as this is a custom callback we need to explicitly log the user in
                if (err) {
                    console.log(err);
                    req.flash("errorMessage", err.message);
                    return res.redirect("/login");
                } else {
                    req.flash("successMessage", "Welcome to YelpCamp " + user.username);
                    res.redirect("/campgrounds");
                }
            });
        }
    })(req, res); //confusingly this is the line that actually calls the function and passes in the arguments
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;