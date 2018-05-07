// ==========================
// CAMPGROUND ROUTES
// ==========================


// NEED TO REFORMAT THESE REQUIRES
var express = require("express");
var router = express.Router();
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory
var Campground = require("../models/campground");





var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);








//INDEX Route - Display info on ALL campgrounds
router.get("/", function(req, res){ //This still goes to /campgrounds but that is specified in app.js when it is used: app.use("/campgrounds", campgroundRoutes);
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            // This could be set up so that the submitted campground is checked and rejected if invalid
            dbErrorResponse(req, res, err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, page: 'campgrounds'}); //pass through the page name so the nav bar highlights the correct icon
        }
    });
});

//GET - Page to add new campground
router.get("/new", middleware.isLoggedIn, function(req, res){ //REST convention for route to form that will be submitted to /campgrounds POST route
    res.render("campgrounds/new");
});

//CREATE - Route to add submitted campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){ //REST convention to use the same route name but as a post to submit 
    
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
          req.flash('error', 'Invalid address');
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
                res.redirect("/campgrounds"); //defaults to a GET request
            }
        });        
    });
});

//SHOW ROUTE - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground from the database using the id provided in the request (:id)
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){ //inside the returned object "foundCampgrounds" it will now contain actual comments and not just reference ids
       if(err || !foundCampground){
            console.log(err);
            req.flash("errorMessage", "Campground not found");
            res.redirect("back");
       } else {
            res.render("campgrounds/show", {campground: foundCampground}); //pass the found campground to the show template
       }
    });
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){ //foundCampground.author.id isn't a string (even though it may look like it when printed out) it's infact a mongoose object
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
   // GEOCODER 
    geocoder.geocode(req.body.Campground.location, function (err, data) {
            if (err || !data.length) {
            req.flash('error', 'Invalid address');
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
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){ //callback function doesn't contain an object (only an error to be handled if required) as it's deleted something, so there's nothing to return
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            req.flash("successMessage", "Successfully deleted campground");
            res.redirect("/campgrounds");
        }
    });
});


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
module.exports = router;