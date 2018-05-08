// ==========================
// AUTH ROUTES
// ==========================

var express = require("express");
var router = express.Router();

// ==========================
// AUTH ROUTES
// ==========================

// USER NEW
var newUserRoute = require("./auth/userNew");
router.get("/register", newUserRoute);

// USER CREATE
var createUserRoute = require("./auth/userCreate");
router.post("/register", createUserRoute);

// LOGIN NEW
var newLoginRoute = require("./auth/loginNew");
router.get("/login", newLoginRoute);

// LOGIN CREATE
var createLoginRoute = require("./auth/loginCreate");
router.post("/login", createLoginRoute);

// LOGOUT
var logoutRoute = require("./auth/logout");
router.get("/logout", logoutRoute);


// ==========================
// MODULE.EXPORTS
// ==========================
module.exports = router;