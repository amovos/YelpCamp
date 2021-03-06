var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

UserSchema.plugin(passportLocalMongoose); //adds a bunch of methods to the UserSchema

module.exports = mongoose.model("User", UserSchema);