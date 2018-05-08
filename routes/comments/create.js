// ==========================
// COMMENT CREATE ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model
var Comment = require("../../models/comment");

var createRoute = function(req, res){
    //look up campground using id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            dbErrorResponse(req, res, err);
        } else { //so the campground has been found in the db
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    dbErrorResponse(req, res, err);
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
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = createRoute;