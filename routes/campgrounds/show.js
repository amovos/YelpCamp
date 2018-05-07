// ==========================
// CAMPGROUND SHOW ROUTE
// ==========================

var Campground = require("../../models/campground"); //require the campground database model

var showRoute = function(req, res){
    //find the campground from the database using the id provided in the request (:id)
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ //inside the returned object "foundCampgrounds" it will now contain actual comments and not just reference ids
       if(err || !foundCampground){
            console.log(err);
            req.flash("errorMessage", "Campground not found");
            res.redirect("/campgrounds");
       } else {
            res.render("campgrounds/show", {campground: foundCampground}); //pass the found campground to the show template
       }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = showRoute;