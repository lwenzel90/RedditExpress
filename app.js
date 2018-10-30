const express = require("express");
const app = express();
const logger = require('./logger.js');

// lets us look at reqest's body 
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));//body parser seperates out the url info

app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/partials"));
app.use(express.static("public/img"));

app.set("view engine", "ejs");

var friends = ["Brian", "Dan", "Kam", "Bailey", "Matt", "Mike"];

var subreddits = ["Funny", "Art", "Music", "Programming", "News"];

var user = {
    email: "",
    userName: "",
    password: "",
    birthDate: new Date()

};

app.get("/", function(req, res){
    res.render("home", {subreddits: subreddits});
});

app.get("/subreddit", function(req, res){
    res.render("subreddit", {subreddits: subreddits});
});

app.post("/subreddit", function(req, res){
    var name = req.body.name;
    // var fullName = req.body.fullName;
    // var description = req.body.description;
    // var rules = req.body.rules;
    // var shortRules = req.body.shortRules;
    subreddits.push(name);
    res.redirect("/subreddit");
});

app.get("/subreddit/new", function(req, res){
    res.render("newSubreddit.ejs");
    
});

app.get("/friends", function(req, res){
    res.render("friends", {friends: friends});//name in other file... name in this file 
});

//test

app.post("/friends", function(req, res){
    var newFriend = req.body.newFriend;//works because of body parser
    friends.push(newFriend);
    res.redirect("friends");
});

app.get("/love", function(req, res){
    //req has all the information about the request made
    //res all of the info related to response 
    var name = ["Logan", "Brian", "Dan", "Kamrin", "Tom", "Bailey", "ManBearPig"];
    res.render("love", {lover: name[Math.floor(Math.random() * name.length)] });    
});

app.get("/posts", function(req, res){
    var posts = [
        {title: "First post on reddit", author: "Mike"},
        {title: "Look at this meme", author: "Tyler"},
        {title: "Classic Post!", author: "Rogger"}
        ];
    res.render("posts", {posts: posts});
});

app.get("/:pageName", function(req, res){ 
    var pageName = req.params.pageName;
    res.render("page404", {pageVar: pageName});
    console.log("Loading 404");
});

//show subreddits
app.get("/r/:subreddit", function(req, res){
    var subreddit = req.params.subreddit;
    res.send("You are trying to connect to the '" + subreddit + "' the subreddit");
});

app.listen(3000, function(){
    console.log("Listening on port 3000");
});

logger.log("hi");