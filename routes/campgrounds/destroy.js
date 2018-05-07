// ==========================
// CAMPGROUND DESTROY ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model

var destroyRoute = function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){ //callback function doesn't contain an object (only an error to be handled if required) as it's deleted something, so there's nothing to return
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            req.flash("successMessage", "Successfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyRoute;