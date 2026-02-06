const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  username: String,
  text: String,
  likes: [String],
  comments: [
    {
      username: String,
      text: String
    }
  ]
});

module.exports = mongoose.model("Post", PostSchema);