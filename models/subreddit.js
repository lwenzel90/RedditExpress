const mongoose = require("mongoose");

const subredditSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: false, unique: false },
    rules: { type: String, required: false, unique: false },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});

module.exports = mongoose.model("Subreddit", subredditSchema);