// ==========================
// MIDDLEWARE
// ==========================

// Require models for the data structures to perform the database searches
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// Define empty object, fill with functions, then export
var middlewareObj = {};

// CHECK CAMPGROUND OWNERSHIP
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){ //foundCampground.author.id isn't a string (even though it may look like it when printed out) it's infact a mongoose object
            if(err || !foundCampground){ //handles the error of a valid ID being sent to the database and it returning null (stops the app crashing)
                console.log(err);
                req.flash("errorMessage", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                //does user own campground?
                if(foundCampground.author.id.equals(req.user._id) || req.user && req.user.isAdmin){ //use this mongoose method .equals() to make a comparison of user ids
                    next(); // if everything works, the middleware is done and it carries on with the code in the particular route
                } else {
                    req.flash("errorMessage", "You don't have permission to edit this campground");
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("errorMessage", "You need to be logged in to edit a campground");
        res.redirect("/login"); //takes the user back to where they came from
    }
};

// CHECK COMMENT OWNERSHIP
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){ //foundCampground.author.id isn't a string (even though it may look like it when printed out) it's infact a mongoose object
            if(err || !foundComment){
                console.log(err);
                req.flash("errorMessage", "Comment not found");
                res.redirect("/campgrounds");
            } else {
                //does user own comment?
                if(foundComment.author.id.equals(req.user._id) || req.user && req.user.isAdmin){ //use this mongoose method .equals() to make a comparison of user ids
                    next(); //if everything works, the middleware is done and it carries on with the code in the particular route
                } else {
                    req.flash("errorMessage", "You don't have permission to edit that comment");
                    res.redirect("/campgrounds");
                }
            }
        });
    } else {
        req.flash("errorMessage", "You need to be logged in to do that");
        res.redirect("/login"); //takes the user back to where they came from
    }
};

// CHECK ISLOGGEDIN
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("errorMessage", "You need to be logged in to do that");
    res.redirect("/login");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = middlewareObj;