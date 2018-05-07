// ==========================
// CAMPGROUND CREATE ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model
var geocoder = require("../shared/geocoder");

var createRoute = function(req, res){ //REST convention to use the same route name but as a post to submit 
    
    // AUTHOR
    //store the author details from the request in the variable "author"
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    //add the author to the newCampground object using dot notation
    req.body.newCampground.author = author; 
    
    
    // GEOCODE
    //generate geocode data (then only create once the geocoder is finished)
    geocoder.geocode(req.body.newCampground.location, function (err, data) {
        if (err || !data.length) {
          req.flash('errorMessage', 'Invalid address');
          return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        
        //add the geocode data to the newCampground object using dot notation
        req.body.newCampground.location = location; //This uses the nicely formatted location that is returned by geocoder and replaces the original content  
        req.body.newCampground.lat = lat; 
        req.body.newCampground.lng = lng;
        
        //Create a new campground and save to database
        Campground.create(req.body.newCampground, function(err, newlyCreated){
            if(err){
                dbErrorResponse(req, res, err);
            } else {
                //redirect back to campgrounds page
                req.flash("successMessage", "Successfully added campground");
                res.redirect("/campgrounds/" + newlyCreated._id); //redirects to the newly created campground
            }
        });        
    });
};


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;