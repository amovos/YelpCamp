// ==========================
// COMMENT NEW ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model
var Comment = require("../../models/comment");

var newRoute =  function(req, res){
    //find campground by the id from the url and check it exists
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("errorMessage", "That campground does not exist");
            res.redirect("/campgrounds");
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;