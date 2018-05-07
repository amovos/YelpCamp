// ==========================
// CAMPGROUND INDEX ROUTE
// ==========================
var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model

var indexRoute = function(req, res){ //This still goes to /campgrounds but that is specified in app.js when it is used: app.use("/campgrounds", campgroundRoutes);
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            // This could be set up so that the submitted campground is checked and rejected if invalid
            dbErrorResponse(req, res, err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'}); //pass through the page name so the nav bar highlights the correct icon
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = indexRoute;