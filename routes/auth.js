const router = require("express").Router();
const User = require("../models/User");

// Signup
router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json("User created");
});

// Login
router.post("/login", async (req, res) => {
  const user = await User.findOne({
    email: req.body.email,
    password: req.body.password,
  });

  if (!user) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
  });
});

module.exports = router;