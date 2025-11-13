const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB Atlas successfully'))
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
});

// Post Schema
const postSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true
  },
  content: { 
    type: String, 
    required: true
  },
  author: { 
    type: String, 
    default: 'Anonymous',
    trim: true
  },
  category: { 
    type: String, 
    default: 'General',
    trim: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Post = mongoose.model('Post', postSchema);

// Routes

// GET all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    console.log('📋 Sending posts:', posts.map(p => ({ id: p._id, title: p.title })));
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
});

// GET single post - COMPLETE DEBUGGING
app.get('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    console.log('🔍 Looking for post with ID:', postId, 'Type:', typeof postId);
    
    // Get all posts first to see what we have
    const allPosts = await Post.find();
    console.log('📚 All posts in database:', allPosts.map(p => p._id.toString()));
    
    let post = null;
    
    // Method 1: Direct find by ID
    if (mongoose.Types.ObjectId.isValid(postId)) {
      console.log('🆔 Trying as MongoDB ObjectId');
      post = await Post.findById(postId);
    }
    
    // Method 2: Find by string comparison
    if (!post) {
      console.log('🔤 Trying as string comparison');
      post = allPosts.find(p => p._id.toString() === postId);
    }
    
    // Method 3: Find by loose comparison
    if (!post) {
      console.log('🔄 Trying loose comparison');
      post = allPosts.find(p => p._id.toString().includes(postId) || postId.includes(p._id.toString()));
    }
    
    if (post) {
      console.log('✅ Found post:', post.title);
      res.json(post);
    } else {
      console.log('❌ Post not found. Available IDs:', allPosts.map(p => p._id.toString()));
      res.status(404).json({ 
        message: 'Post not found',
        requestedId: postId,
        availableIds: allPosts.map(p => p._id.toString())
      });
    }
  } catch (error) {
    console.error('💥 Error fetching post:', error);
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// CREATE post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author, category } = req.body;
    
    const postData = {
      title,
      content,
      author: author || 'Anonymous',
      category: category || 'General',
      createdAt: new Date()
    };
    
    const post = new Post(postData);
    await post.save();
    
    console.log('✅ Created new post:', { id: post._id, title: post.title });
    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: 'Error creating post' });
  }
});

// UPDATE post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, content, author, category } = req.body;
    
    const updateData = {
      title,
      content,
      author: author || 'Anonymous',
      category: category || 'General'
    };
    
    let post;
    
    if (mongoose.Types.ObjectId.isValid(postId)) {
      post = await Post.findByIdAndUpdate(
        postId,
        updateData,
        { new: true, runValidators: true }
      );
    }
    
    if (!post) {
      const allPosts = await Post.find();
      post = allPosts.find(p => p._id.toString() === postId);
      if (post) {
        post = await Post.findByIdAndUpdate(
          post._id,
          updateData,
          { new: true, runValidators: true }
        );
      }
    }
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(400).json({ message: 'Error updating post' });
  }
});

// DELETE post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    
    let post;
    
    if (mongoose.Types.ObjectId.isValid(postId)) {
      post = await Post.findByIdAndDelete(postId);
    }
    
    if (!post) {
      const allPosts = await Post.find();
      post = allPosts.find(p => p._id.toString() === postId);
      if (post) {
        post = await Post.findByIdAndDelete(post._id);
      }
    }
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: 'Error deleting post' });
  }
});

// GET all categories
app.get('/api/categories', async (req, res) => {
  try {
    res.json([
      { _id: 1, name: 'Technology' },
      { _id: 2, name: 'Lifestyle' },
      { _id: 3, name: 'Travel' }
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE category
app.post('/api/categories', async (req, res) => {
  try {
    res.status(201).json(req.body);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    message: '✅ MERN Blog API is running!',
    database: mongoose.connection.readyState === 1 ? 'Connected to MongoDB Atlas' : 'Disconnected'
  });
});

// COMPLETE DATABASE RESET WITH BETTER DEBUGGING
app.get('/api/reset-database', async (req, res) => {
  try {
    // Clear ALL existing data
    await Post.deleteMany({});
    console.log('🗑️  Cleared all posts');
    
    // Create fresh posts
    const posts = await Post.insertMany([
      {
        title: 'Welcome to Your MERN Blog',
        content: 'This is your fully functional MERN stack blog application! You can create, read, update, and delete blog posts.',
        author: 'Admin',
        category: 'Technology'
      },
      {
        title: 'Getting Started with React Development',
        content: 'React is a powerful JavaScript library for building user interfaces. Learn about components, props, state, and hooks.',
        author: 'React Developer',
        category: 'Tutorials'
      },
      {
        title: 'Mastering MongoDB for Web Applications',
        content: 'MongoDB is a NoSQL database that provides high performance and scalability for modern applications.',
        author: 'Database Expert',
        category: 'Technology'
      }
    ]);
    
    console.log('✅ Created new posts:', posts.map(p => p._id.toString()));
    
    res.json({ 
      message: '✅ Database completely reset and seeded with fresh data!',
      postsCreated: posts.length,
      postIds: posts.map(p => p._id.toString()),
      note: 'Check the server console for detailed post IDs'
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    res.status(500).json({ message: error.message });
  }
});

// COMPLETE DEBUG INFO
app.get('/api/debug', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    
    res.json({
      totalPosts: posts.length,
      posts: posts.map(p => ({
        _id: p._id,
        _idString: p._id.toString(),
        _idType: typeof p._id,
        title: p.title,
        category: p.category,
        author: p.author,
        createdAt: p.createdAt
      })),
      serverInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        mongodbConnected: mongoose.connection.readyState === 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api`);
  console.log(`🔄 Reset Database: http://localhost:${PORT}/api/reset-database`);
  console.log(`🐛 Debug Info: http://localhost:${PORT}/api/debug`);
});