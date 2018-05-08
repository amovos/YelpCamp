// ==========================
// LOGOUT ROUTE
// ==========================

var newRoute =  function(req, res) {
    req.logout();
    req.flash("successMessage", "Successfully logged out! Come back soon :)");
    res.redirect("/campgrounds");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;









