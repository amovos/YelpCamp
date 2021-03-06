// ==========================
// REQUIRE NPM PACKAGES
// ==========================
var flash           = require("connect-flash"),
    express         = require("express"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    bodyParser      = require("body-parser"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override");


// ==========================
//GENERIC APP CONFIG
// ==========================
var app = express();
app.use(flash());
app.set("view engine", "ejs"); // don't need to add .ejs to the end of all those files when routing
app.use(methodOverride("_method")); // method override needed for HTML forms that can't do PUT so have to be POST, then overrided to PUT once submitted with this override added to the URL
app.use(express.static(__dirname + "/public")); //Configure Public Directory
app.use(bodyParser.urlencoded({extended: true}));

app.locals.moment = require('moment'); //used for time tracking


// ==========================
// DB CONFIG
// ==========================
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"; //creates a backup so that if the environment variable isn't set up it has a backup
mongoose.connect(url);


// ==========================
// REQUIRE DB MODELS
// ==========================
var User = require("./models/user");
    
    
// ==========================
// PASSPORT CONFIG
// ==========================
var pwdSalt = process.env.SECRETSALT || "Dev Salt";
app.use(require("express-session")({
    secret: pwdSalt,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//These methods that we're passing in come from passport-local-mongoose in the users.js file
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ==========================
// SEED DATABASE
// ==========================
var seedDB = require("./seeds");
//seedDB(); //Run the seedDB file - Removed for now


// ==========================
// CUSTOM MIDDLEWARE
// ==========================
//This will run every time any route is accessed and will pass the user to it, making it available in the ejs templates

//This particular middleware adds the user info to each request (will be undefined if the user isn't authenticated)
//This means that in any ejs template we can access user data using: currentUser.
app.use(function(req, res, next){ 
    res.locals.currentUser = req.user;
    res.locals.errorMessage = req.flash("errorMessage"); //This variable is avaialble in the header partial, and if it exists it contains the message
    res.locals.successMessage = req.flash("successMessage"); //This variable is avaialble in the header partial, and if it exists it contains the message
    next();
});


// ==========================
// ROUTES
// ==========================
var indexRoutes         = require("./routes/index"),
    authRoutes          = require("./routes/auth"),
    commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds");

//once the route files have been required they need to actually be used in the app, using the Express Router
//the URLs can be shortened here by adding the first common part here e.g. /campgrounds.
app.use("/", indexRoutes);
app.use("/", authRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// ==========================
// START SERVER
// ==========================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Server is listening...");
});