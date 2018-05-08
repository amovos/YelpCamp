// ==========================
// CAMPGROUND ROUTES
// ==========================

var express = require("express");
var router = express.Router();
var middleware = require("../middleware"); //don't need to specify index.js, it's a special name when you require a directory

// ==========================
// RESTFUL ROUTES
// ==========================

// INDEX CAMPGROUND ROUTE - Display info on ALL campgrounds
var indexRoute = require("./campgrounds/index");
router.get('/', indexRoute);

// NEW CAMPGROUND ROUTE - Page to add new campground
var newRoute = require("./campgrounds/new");
router.get("/new", middleware.isLoggedIn, newRoute);

// CREATE CAMPGROUND ROUTE - Route to add submitted campground to DB
var createRoute = require("./campgrounds/create");
router.post("/", middleware.isLoggedIn, createRoute);

// SHOW CAMPGROUND ROUTE - shows more info about one campground
var showRoute = require("./campgrounds/show");
router.get("/:id", showRoute);

// EDIT CAMPGROUND ROUTE
var editRoute = require("./campgrounds/edit");
router.get("/:id/edit", middleware.checkCampgroundOwnership, editRoute);

// UPDATE CAMPGROUND ROUTE
var updateRoute = require("./campgrounds/update");
router.put("/:id", middleware.checkCampgroundOwnership, updateRoute);

// DESTROY CAMPGROUND ROUTE
var destroyRoute = require("./campgrounds/destroy");
router.delete("/:id", middleware.checkCampgroundOwnership, destroyRoute);


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;