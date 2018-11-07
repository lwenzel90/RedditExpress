// This file is where the reddit clone is 
// called from. Most of what is happening here 
// is to do with http routing of the app. 
// Routes point to templated pages using ejs
// A db is setup using mongo and mongoose below
var express    = require("express"),
    app        = express(),
    logger     = require('./logger.js'),
    mongoose   = require("mongoose"),
    bodyParser = require("body-parser");
    
    
mongoose.connect("mongodb://localhost:27017/reddit_clone", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));//body parser seperates out the url info

// Schema Creation
var userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    email: String,
    isAdmin: Boolean,
    age: Date, 
});

var subredditSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true }, 
    description: {type: String, required: false, unique: false},
    rules: {type: String, required: false, unique: false}, 

});

var subreddit = mongoose.model("subreddit", subredditSchema);

subreddit.create({
    name: "funny", 
    description: "We like jokes!",
    rules: "Make all jokes in good taste"
}, function(err, subreddit){
    if(err){
        console.log("error at subreddit creation");
    } else{
        console.log("funny subreddit created");
    }
});



// // creates a object with methods to manipulate the db
// var User = mongoose.model("User", userSchema);

// User.create({
//     username: "JohnsADoeFoSho", 
//     password: "password123", 
//     email: "example@gmail.com",
//     isAdmin: true,
//     age: new Date('October 07, 1997 00:00:00')
// }, function(err, user){
//     if(err){
//         console.log(err);
//     } else{
//         console.log(user)
//     }
// });

// User.find({}, function(err, user){
//     if(err){
//         console.log(err);
//     } else{
//         console.log("----------------------------");
//         console.log("-------All DB entries-------");
//         console.log("----------------------------");
//         console.log(user);
//     }
// });

// var newUser = new User({
//     username: "JohnDoe", 
//     password: "password123", 
//     email: "example@gmail.com",
//     isAdmin: true,
//     age: new Date('October 07, 1997 00:00:00')
// });

// newUser.save(function(err, user){
//     if(err){
//         console.log("something went wrong when inserting to the db");
//     } else{
//         console.log("Item saved to db");
//         console.log(user);
//     }
// });

// lets us look at reqest's body 

app.use(express.static("public/css"));
app.use(express.static("public/js"));
app.use(express.static("public/partials"));
app.use(express.static("public/img"));


// var friends = ["Brian", "Dan", "Kam", "Bailey", "Matt", "Mike"];

var subreddits = ["Funny", "Art", "Music", "Programming", "News"];

app.get("/", function(req, res){
    res.render("home", {subreddits: subreddits});
});

// app.get("/users", function(req, res){
//     User.find({}, function(err, allUsers){
//         if(err){
//             //console.log(err);
//         } else{
//             res.render("users", {users:allUsers});
//         }
//     })
// });

app.get("/subreddit", function(req, res){
    subreddit.find({}, function(err, subreddits){
        if(err){
            //console.log(err);
        } else{
            res.render("subreddit", {subreddits: subreddits});
        }
    });
    
});

app.post("/subreddit", function(req, res){
    var name = req.body.name;
    // var fullName = req.body.fullName;
    var description = req.body.description;
    var rules = req.body.rules;
    var newSubreddit = {name: name, rules: rules, description: description};
    // var shortRules = req.body.shortRules;

    subreddit.create(newSubreddit, function(err, newEntry){
        if(err){
            console.log(err);
        } else{
            res.redirect("/subreddit");
        }
    });
    
});

app.get("/subreddit/new", function(req, res){
    res.render("newSubreddit.ejs");
    
});

app.get("/friends", function(req, res){
    res.render("friends", {friends: friends});//name in other file... name in this file 
});

//test

// app.post("/friends", function(req, res){
//     var newFriend = req.body.newFriend;//works because of body parser
//     friends.push(newFriend);
//     res.redirect("friends");
// });

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