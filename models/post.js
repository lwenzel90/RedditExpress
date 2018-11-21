const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title: String,
    content: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    subredditSchema : { type: mongoose.Schema.Types.ObjectId, ref: "Subreddit"}
    // comments: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Comment "
    //     }
    // ]
});

module.exports = mongoose.model("Post", postSchema);

