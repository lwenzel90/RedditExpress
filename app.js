// This file is where the reddit clone is 
// called from. Most of what is happening here 
// is to do with http routing of the app. 
// Routes point to templated pages using ejs
// A db is setup using mongo and mongoose below
const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    Post = require("./models/post"),
    User = require("./models/user"),
    Subreddit = require("./models/subreddit"),
    seedDB = require("./seeds");

mongoose.connect("mongodb://localhost:27017/reddit_clone", { useNewUrlParser: true });
seedDB();
app.set("view engine", "ejs");

//body parser seperates out the url info from post requests
//middleware to use later in app
app.use(bodyParser.urlencoded({ extended: true }));

// -----------------------------
// Test DB functions
// -----------------------------

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
    res.render("subredditForm");
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
    Subreddit.findById(req.params.id).populate("posts").exec(function (err, foundSubreddit) {
        if (err) {
            console.log(err);
        } else {
            console.log(`found subreddit ${foundSubreddit}`);
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
app.get("/r/:subreddit", (req, res) => {
    res.send("You are trying to connect to the " + req.params.subreddit + " the subreddit");
});


app.listen(3000, () => console.log("Listening on port 3000"));