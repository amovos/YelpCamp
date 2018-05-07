// ==========================
// CAMPGROUND EDIT ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model

var editRoute = function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){ //foundCampground.author.id isn't a string (even though it may look like it when printed out) it's infact a mongoose object
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = editRoute;