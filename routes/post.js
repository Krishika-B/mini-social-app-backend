const router = require("express").Router();
const Post = require("../models/Post");

// Create post
router.post("/", async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json("Post created");
});

// Get feed
router.get("/", async (req, res) => {
  const posts = await Post.find();
  res.json(posts);
});

// Like post
router.post("/:id/like", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { likes: req.body.username }
  });
  res.json("Liked");
});

// Comment
router.post("/:id/comment", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    $push: { comments: req.body }
  });
  res.json("Comment added");
});

module.exports = router;