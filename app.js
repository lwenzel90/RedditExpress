// This file is where the reddit clone is 
// called from. Most of what is happening here 
// is to do with http routing of the app. 
// Routes point to templated pages using ejs
// A db is setup using mongo and mongoose below
const express = require("express"),
    app = express(),
    logger = require('./logger.js'),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser");


mongoose.connect("mongodb://localhost:27017/reddit_clone", { useNewUrlParser: true });
app.set("view engine", "ejs");

//body parser seperates out the url info from post requests
//middleware to use later in app
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------
// DB Schema and test insertions
// -----------------------------

const postSchema = new mongoose.Schema({
    title: String,
    content: String
});
const Post = mongoose.model("Post", postSchema);

const newPost = new Post({
    title: "First Post",
    content: "Hey world this is a reddit post"
});

newPost.save(function (err, post) {
    if (err) {
        console.log(err);
    } else {
        console.log(post);
    }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: String,
    isAdmin: Boolean,
    posts: [postSchema]
});

// creates a object with methods to manipulate the db
const User = mongoose.model("User", userSchema);

// const newUser = new User({
//     username: "lwenzel90", 
//     password: "password123", 
//     email: "example@gmail.com",
//     isAdmin: true
// });

// newUser.posts.push(newPost);
// newUser.save(function(err, user){
//     if(err){ 
//         console.log(err) 
//     } else{
//         console.log(user);
//     }
// });

// User.create({
//     username: "lwenzel90", 
//     password: "password123", 
//     email: "example@gmail.com",
//     isAdmin: true
// }, function(err, user){
//     if(err){
//         console.log("User entry error");
//         console.log(err.message);
//     } else{
//         console.log("Below User Added to DB");
//         console.log(user);
//     }
// });

const subredditSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false, unique: false },
    rules: { type: String, required: false, unique: false }
});

const Subreddit = mongoose.model("Subreddit", subredditSchema);


// Subreddit.create({
//     name: "gaming", 
//     description: "We like jokes!",
//     rules: "Make all jokes in good taste"
// }, function(err, subreddit){
//     if(err){
//         console.log("error at subreddit creation");
//     } else{
//         console.log("newly added subreddit is " + subreddit.name);
//     }
// });

//-------------
//Set up routes 
//-------------

// allow use of nondynamic resources by the app  
app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/partials"));
app.use(express.static("public/img"));

app.get("/", function (req, res) {
    Subreddit.find({}, function (err, subreddits) {
        if (err) {
            console.log("Home page Subreddit query error");
            console.log(err);
            res.render("Page404", { subreddits: subreddits });
        } else {
            res.render("index", { subreddits: subreddits });
        }
    });
});

//subreddit index route 
app.get("/subreddit", function (req, res) {
    Subreddit.find({}, function (err, subreddits) {
        if (err) {
            console.log("Subreddit query error");
            console.log(err);
            res.render("index", { subreddits: subreddits });
        } else {
            res.render("subreddit", { subreddits: subreddits });
        }
    });
});

// route to form to make new subreddit 
app.get("/subreddit/new", function (req, res) {
    res.render("newSubreddit");
});

// adds subreddit to database from form
app.post("/subreddit", function (req, res) {
    const name = req.body.name;
    const description = req.body.description;
    const rules = req.body.rules;
    const newSubreddit = { name: name, description: description, rules: rules };

    Subreddit.create(newSubreddit, function (err, newEntry) {
        if (err) {
            console.log("subreddit creation error");
            console.log(err);
        } else {
            console.log("Below subreddit has been added to DB");
            console.log(newEntry.name);
            res.redirect("/subreddit");
        }
    });
});

// Show an individual subreddit
app.get("/subreddit/:id", function (req, res) {
    Subreddit.findById(req.params.id, function (err, foundSubreddit) {
        if (err) {
            console.log(err);
        } else {
            //render show template
            res.render("subredditShow", { subreddit: foundSubreddit });
        }
    });
});

app.get("/users", function (req, res) {
    User.find({}, function (err, allUsers) {
        if (err) {
            console.log("Users query error");
            console.log(err.message);
        } else {
            res.render("users", { users: allUsers });
        }
    })
});

app.get("/posts", function (req, res) {
    const posts = [
        { title: "First post on reddit", author: "Mike" },
        { title: "Look at this meme", author: "Tyler" },
        { title: "Classic Post!", author: "Rogger" }
    ];
    res.render("posts", { posts: posts });
});

app.get("/:pageName", function (req, res) {
    const pageName = req.params.pageName;
    console.log(req.originalUrl);
    res.render("page404", { pageVar: pageName });
});

//show subreddits
app.get("/r/:subreddit", function (req, res) {
    const subreddit = req.params.subreddit;
    res.send("You are trying to connect to the '" + subreddit + "' the subreddit");
});

app.listen(3000, function () {
    console.log("Listening on port 3000");
});

//custom written middleware
//logger.log("hi");