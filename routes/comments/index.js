// ==========================
// CAMPGROUND INDEX ROUTE
// ==========================
var Campground = require("../../models/campground");

var index = function(req, res){ //This still goes to /campgrounds but that is specified in app.js when it is used: app.use("/campgrounds", campgroundRoutes);
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

// Database Error Response Function
// Not likely to happen to as immediately before it always checks the user in the DB
function dbErrorResponse(req, res, err){
    console.log(err);
    req.flash("errorMessage", "Error: Can't connect to the database");
    res.redirect("back");
}

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = index;