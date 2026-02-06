//// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

// For image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// MongoDB connection
mongoose.connect("mongodb+srv://krishikabalamurali_db_user:Krishika%4015@cluster0.ni1brdk.mongodb.net/miniSocial")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schemas
const User = mongoose.model('User', new mongoose.Schema({
  email: String,
  password: String
}));

const Post = mongoose.model('Post', new mongoose.Schema({
  username: String,
  text: String,
  image: String,
  likes: [String],
  comments: [{ username: String, text: String }],
  createdAt: { type: Date, default: Date.now }
}));

// ======= Routes =======

// Signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send('Missing fields');

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).send('User already exists');

    await User.create({ email, password });
    res.status(201).send('User created');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating user');
  }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(400).send('Invalid credentials');
  res.status(200).send('Login successful');
});

// Create post
app.post('/posts', upload.single('image'), async (req, res) => {
  const { text, username } = req.body;
  let imagePath = null;
  if (req.file) imagePath = req.file.filename;

  try {
    const post = await Post.create({ username, text, image: imagePath, likes: [], comments: [] });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating post');
  }
});

// Get all posts
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching posts');
  }
});

// Like post
app.post('/posts/:id/like', async (req, res) => {
  const { username } = req.body;
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).send('Post not found');

    if (!post.likes.includes(username)) post.likes.push(username);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error liking post');
  }
});

// Comment on post
app.post('/posts/:id/comment', async (req, res) => {
  const { username, text } = req.body;
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).send('Post not found');

    post.comments.push({ username, text });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error commenting on post');
  }
});

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start server
app.listen(5000, () => console.log('Server running on port 5000')); 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});