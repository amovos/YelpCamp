// ==========================
// INDEX ROUTES
// ==========================

var express = require("express");
var router = express.Router();
var passport = require("passport");

var Campground = require("../models/campground");
var Comment = require("../models/comment");
var User = require("../models/user");
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory


// ==========================
// ROOT ROUTE
// ==========================
router.get("/", function(req, res){
    res.render("landing");
});


// ==========================
// AUTH ROUTES
// ==========================

// Show the register form
router.get("/register", function(req, res){
    res.render("register", {page: 'register'});
});

// Handle Signup Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username}); //Creates a new user with just a username
    User.register(newUser, req.body.password, function(err, user){ //pass the password to the passport-local-mongoose method. This means you don't store the password in plain text, only the hash.
        if(err){
            console.log(err);
            req.flash("errorMessage", err.message);
            return res.redirect("back"); //return required so it doesn't continue with the rest of the code. Could also use "else if"
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("successMessage", "Welcome to YelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    }); 
});


// Show Login Form
router.get("/login", function(req, res){
    res.render("login", {page: 'login'}); //why not a redirect? This is the route that actually tells it what to render.
});

// Handling Login Logic
//This method doesn't allow for flash messages, and was inconsistent with the sign up method, need to review
router.post("/login", passport.authenticate("local",  //app.post("/login", middleware, callback)
    {
        successRedirect: "/campgrounds",  //not sure how to add flash messages here
        failureRedirect: "/login"    
    }), function(req, res){ // what shoule go here?
});


// Logout Route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("successMessage", "Successfully logged out! Come back soon :)");
    res.redirect("/campgrounds");
});


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;