// ==========================
// COMMENTS ROUTES
// ==========================

var express = require("express");
var router = express.Router({mergeParams: true}); //{mergeParams: true} means that even though :id isn't in the path in this file it still gets passed through so it can be used.
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory

var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find campground by the id from the url
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    });
});

//Comments CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
    //look up campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            dbErrorResponse(req, res, err); //not sure what this line does
        } else { //so the campground has been found in the db
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err); //does the server hang if this occurs? No error message is show to the user?
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    
                    //connect new comment to the currently found campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect back to campground show page
                    console.log(comment);
                    req.flash("successMessage", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

// EDIT COMMENT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){ //need to check if the campground is valid before editing the comment. As they might own the comment, but if the campground doesn't exist it will crash the server
            console.log(err);
            req.flash("errorMessage", "Campground not found");
            res.redirect("back");
        } else {
            Comment.findById(req.params.comment_id, function(err, foundComment) {
                if(err){
                    dbErrorResponse(req, res, err);
                } else {
                    res.render("comments/edit", {campground_id: req.params.id, comment: foundComment}); //this is the campground id that comes from the app.js
                }
            });
        }
    });
});

// UPDATE COMMENT ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            req.flash("successMessage", "Successfully updated comment");
            res.redirect("/campgrounds/" + req.params.id); //this is the ID of the campground that comes from the first part of the request URL that's in the app.js file
        }
    });
});

// DESTROY COMMENT ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
            req.flash("successMessage", "Successfully deleted comment");
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