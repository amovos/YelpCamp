// ==========================
// COMMENT EDIT ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model
var Comment = require("../../models/comment");

var editRoute = function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){ //need to check if the campground is valid before editing the comment. As they might own the comment, but if the campground doesn't exist it will crash the server
            console.log(err);
            req.flash("errorMessage", "Campground not found");
            res.redirect("/campgrounds");
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
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = editRoute;