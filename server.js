const express = require('express');
const bodyParser = require('body-parser');
const PostRepository = require('./PostRepository');

const app = express();
const port = 3000;
const postsRepo = new PostRepository();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Post routes
app.post('/posts', createPost);
app.get('/posts/:id', getPostById);
app.delete('/posts/:id', deletePost);
app.put('/posts/:id', updatePost);
app.get('/posts', getAllPosts);

// Route handler functions
async function createPost(req, res) {
    try {
        res.status(201).json({ posts: JSON.stringify(posts) });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
}

async function getPostById(req, res) {
    try {
        const postId = req.params.id;
        const post = await postsRepo.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve post' });
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        const deleted = await postsRepo.deletePost(postId);
        res.status(200).json({ message: deleted ? 'Post deleted successfully': 'Post to delete not found' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
}

async function updatePost(req, res) {
    try {
        const postId = req.params.id;
        const updatedPost = req.body;
        const post = await postsRepo.updatePost(postId, updatedPost);
        // TODO: Implement post update logic
        // Expected req.body to contain updated post data
        res.status(200).json({ message: 'Post updated successfully', post });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
}

async function getAllPosts(req, res) {
    try {
        const posts = await postsRepo.getAllPosts();
        res.status(201).json({ posts });
    } catch (error) {
        res.status(500).json({ error: `Failed to get all posts. Got error: ${getErrorDetails(error)}` });
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

function getErrorDetails(error) {
    return {
        message: error.message,
        stack: error.stack,
        code: error.code, // Useful for file system errors
        name: error.name
    };
}
