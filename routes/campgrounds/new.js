// ==========================
// CAMPGROUND NEW ROUTE
// ==========================

var newRoute =  function(req, res){ //REST convention for route to form that will be submitted to /campgrounds POST route
    res.render("campgrounds/new");
};

// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = newRoute;