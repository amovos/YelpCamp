// ==========================
// CAMPGROUND UPDATE ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model
var geocoder = require("../shared/geocoder");

var updateRoute = function(req, res){
    // GEOCODER 
    geocoder.geocode(req.body.Campground.location, function (err, data) {
            if (err || !data.length) {
            req.flash('errorMessage', 'Invalid address');
            return res.redirect('back');
        }
        req.body.Campground.lat = data[0].latitude;
        req.body.Campground.lng = data[0].longitude;
        req.body.Campground.location = data[0].formattedAddress;
       
        //find and update the correct campground
        Campground.findByIdAndUpdate(req.params.id, req.body.Campground, function(err, updatedCampground){
            if(err){
                dbErrorResponse(req, res, err);
            } else {
                req.flash("successMessage", "Successfully updated campground");
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = updateRoute;