const mongoose = require("mongoose");
const Subreddit = require("./models/subreddit");
const Post = require("./models/post");
const User = require("./models/user");

var data = [
    {
        name: "funny", 
        description: "We like to laugh here",
        rules: "Please spread positivity"
    },
    {
        name: "pictures", 
        description: "Where the beauty of the world is captured",
        rules: "Be nice and aesthetic "
    },
    {
        name: "jobs", 
        description: "Working together to get you hired!",
        rules: "Please be professional and courteous  "
    }
]

function seedDB(){
    //Remove all subreddits
    User.remove({}, function(err){
        if(err){
            console.log(err);
        }
    });
    Subreddit.remove({}, function(err){
        if(err){
            console.log(err);
        }
        //console.log("removed subreddits");
        Post.remove({}, function(err){
            if(err){
                console.log(err);
            }
            //console.log("removed posts");
            data.forEach(function(seed){
                Subreddit.create(seed, function(err, subreddit){
                    if(err){
                        console.log(err);
                    } else {
                        //console.log("added a subreddit: " + seed.name);
                        //create a post
                        Post.create(
                        {
                            title: "POST EXAMPLE",
                            content: "Created on creation of the DB! SEEDED DATA"
                        }, function(err, post){
                            if(err){
                                console.log(err);
                            } else{
                                subreddit.posts.push(post);
                                subreddit.save();
                                //console.log("created new post in a seeded subreddit");
                            }
                        });
                    }
                });
            });
        });
    });
    console.log("DB Seeding complete");
}

module.exports = seedDB;