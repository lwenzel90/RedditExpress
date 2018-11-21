const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String},
    isAdmin: Boolean,
    // Object reference to posts
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
});

userSchema.plugin(passportLocalMongoose); // adds special methods to schema

// creates a object with methods to manipulate the db
module.exports = mongoose.model("User", userSchema);