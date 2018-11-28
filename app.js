// This file is where the reddit clone is 
// called from. Most of what is happening here 
// is to do with http routing of the app. 
// Routes point to templated pages using ejs
// A db is setup using mongo and mongoose below
const express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    Posts = require("./models/post"),
    User = require("./models/user"),
    Subreddit = require("./models/subreddit"),
    seedDB = require("./seeds"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    path = require("path"),
    passportLocalMongoose = require("passport-local-mongoose");


mongoose.connect("mongodb://localhost:27017/reddit_clone", { useNewUrlParser: true });
//seedDB();

app.set("view engine", "ejs");

//body parser seperates out the url info from post requests
//middleware to use later in app
app.use(bodyParser.urlencoded({ extended: true }));

app.use(require("express-session")({
    secret: "Oh boy I have gotten ligma",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// allow use of nondynamic resources by the app  
app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/partials"));
app.use(express.static(__dirname + "/public/img"));
console.log(__dirname);
//-------------
//Set up routes 
//-------------

app.get("/", function (req, res) {
    Subreddit.find({}, function (err, subreddits) {
        if (err) {
            console.log("Home page Subreddit query error");
            console.log(err);
            res.render("Page404", { subreddits: subreddits });
        } else {
            let data = {
                user: req.user,
                subreddits: subreddits
            }
            res.render("landing", { data: data });
        }
    });
});

app.get("/posts/new", isLoggedIn, function (req, res) {
    Subreddit.find({}, function (err, subreddits) {
        if (err) {
            console.log("Home page Subreddit query error");
            console.log(err);
            res.render("Page404");
        } else {
            res.render("posts/new", { subreddits: subreddits });
        }
    });
});

app.post("/posts", isLoggedIn, function (req, res) {
    if (req.user) {
        const title = req.body.title;
        const content = req.body.content;
        const user = req.user.username;
        const subreddit = req.body.subreddit;
        // NEED TO DO 
        // find the subreddit that the form returns then add the post to the subreddit 
        // add post to the subreddit and add the subreddit to the post
        const newPost = { title: title, content: content, user: user, subreddit: subreddit };

    } else {
        res.send("This is not working");
    }
});

//user sign up form 
app.get("/user/register", function (req, res) {
    res.render("users/register");
});

//handle form submit of new user
app.post("/register", function (req, res) {
    //hashes password
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("users/register");
        }
        //log user in and store info 
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        });
    });
});

app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/failedLogin"
}), function (req, res) {

});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/");
}

//subreddit show route 
app.get("/subreddit", function (req, res) {
    Subreddit.find({}, function (err, subreddits) {
        if (err) {
            console.log("Subreddit query error");
            console.log(err);
            res.render("landing", { subreddits: subreddits });
        } else {

            let data = {
                user: req.user,
                subreddits: subreddits
            }
            res.render("subreddits/show", { data: data });

        }
    });
});

// route to form to make new subreddit 
app.get("/subreddit/new", function (req, res) {
    res.render("subreddits/new");
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
            Subreddit.find({}, function (err, subreddits) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("subreddits/show", { subreddits: subreddits });
                }

            });

        }
    });
});

// subreddit index route (individual subreddit)
// gets all subreddits for nav bar then gets the specific 
// subreddit by the id
app.get("/subreddit/:id", function (req, res) {
    let allSubreddits;
    Subreddit.find({}, function (err, subreddits){
        if(err){
            console.log(err);
            res.redirect("/");
        } else{
            allSubreddits = subreddits;
        }
    });
    
    Subreddit.findById(req.params.id).populate("posts").exec(function (err, foundSubreddit) {
        if (err) {
            console.log(err);
        } else {
            let data = {
                foundSubreddit: foundSubreddit,
                allSubreddits: allSubreddits, 
                user: req.user
            }
            console.log(`found subreddit ${foundSubreddit}`);
            //render show template
            res.render("subreddits/index", { data: data });
        }
    });
    
});

app.get("/user", function (req, res) {
    User.find({}, function (err, allUsers) {
        if (err) {
            console.log("Users query error");
            console.log(err.message);
        } else {
            res.render("users/show", { users: allUsers });
        }
    })
});

// app.get("/:pageName", function (req, res) {
//     const pageName = req.params.pageName;
//     console.log(req.originalUrl);
//     res.render("page404", { pageVar: pageName });
// });

app.listen(80, () => console.log("Listening on port default port(80)"));