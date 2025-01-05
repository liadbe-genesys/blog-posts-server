const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

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
        // TODO: Implement post creation logic
        // Expected req.body to contain post data
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create post' });
    }
}

async function getPostById(req, res) {
    try {
        const postId = req.params.id;
        // TODO: Implement logic to fetch post by ID
        res.status(200).json({ message: 'Post retrieved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve post' });
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        // TODO: Implement post deletion logic
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete post' });
    }
}

async function updatePost(req, res) {
    try {
        const postId = req.params.id;
        // TODO: Implement post update logic
        // Expected req.body to contain updated post data
        res.status(200).json({ message: 'Post updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update post' });
    }
}

async function getAllPosts(req, res) {
    try {
        // TODO: Implement logic to fetch all posts
        res.status(200).json({ message: 'Posts retrieved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve posts' });
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
