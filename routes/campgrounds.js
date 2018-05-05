// ==========================
// CAMPGROUND ROUTES
// ==========================

var express = require("express");
var router = express.Router();
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory

var Campground = require("../models/campground");

//Index Route - Display info on ALL campgrounds
router.get("/", function(req, res){ //This still goes to /campgrounds but that is specified in app.js when it is used: app.use("/campgrounds", campgroundRoutes);
    //Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            // This could be set up so that the submitted campground is checked and rejected if invalid
            dbErrorResponse(req, res, err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});

//GET - Page to add new campground
router.get("/new", middleware.isLoggedIn, function(req, res){ //REST convention for route to form that will be submitted to /campgrounds POST route
    res.render("campgrounds/new");
});

//POST - Route to add submitted campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){ //REST convention to use the same route name but as a post to submit 
    
    // store the author details from the request in the variable "author"
    var author = {
        id: req.user._id,
        username: req.user.username
    };

    //add the author to the newCampground object using dot notation
    req.body.newCampground.author = author; 
    
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
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.newCampground, function(err, updatedCampground){
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            req.flash("successMessage", "Successfully updated campground");
            res.redirect("/campgrounds/" + req.params.id);
        }
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