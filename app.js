const express = require("express");
const app = express();
const logger = require('./logger.js');

// lets us look at reqest's body 
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));//not sure what this does 

app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/partials"));
app.use(express.static("public/img"));

app.set("view engine", "ejs");

var friends = ["Dylan", "Bailey", "Mike", "Matt", "Shawn"];

app.get("/", function(req, res){
    res.render("home");
});

app.get("/friends", function(req, res){
    res.render("friends", {friends: friends});//name in other file... name in this file 
});

//test

app.post("/addfriend", function(req, res){
    var newFriend = req.body.newFriend;//works because of body parser
    friends.push(newFriend);
    res.redirect("/friends");
});

app.get("/love", function(req, res){
    //req has all the information about the request made
    //res all of the info related to response 
    var name = ["Logan", "Brian", "Dan", "Kamrin", "Tom", "Bailey", "ManBearPig"];
    res.render("love", {lover: name[Math.floor(Math.random() * name.length)] });
    //res.send("<h1>Welcome to the home page!</h1><h2>blah blah blah</h2>"); 
});

app.get("/posts", function(req, res){
    var posts = [
        {title: "First post on reddit", author: "Mike"},
        {title: "Look at this meme", author: "Tyler"},
        {title: "Classic Shit Post!", author: "Rogger"}
        ];
    res.render("posts", {posts: posts});
});

app.get("/:pageName", function(req, res){ 
    var pageName = req.params.pageName;
    res.render("newPage", {pageVar: pageName});
});

//show subreddits
app.get("/r/:subreddit", function(req, res){
    var subreddit = req.params.subreddit;
    res.send("You are trying to connect to '" + subreddit + "' the subreddit");
});

app.listen(3000, function(){
    console.log("Listening on port 3000");
});

logger.log("hi");