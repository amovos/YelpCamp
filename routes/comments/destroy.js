// ==========================
// COMMENT DESTROY ROUTE
// ==========================

var dbErrorResponse = require("../shared/dbErrorResponse"); //require the shared function for a database error
var Campground = require("../../models/campground"); //require the campground database model
var Comment = require("../../models/comment");

var destroyRoute = function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            dbErrorResponse(req, res, err);
        } else {
            res.redirect("/campgrounds/" + req.params.id);
            req.flash("successMessage", "Successfully deleted comment");
        }
    });
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = destroyRoute;