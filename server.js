const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const PostRepository = require('./PostRepository');

const app = express();
app.use(cors());

const port = 3000;
const postsRepo = new PostRepository();
const requiredFields = ['title', 'href', 'description', 'category'];

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Post routes
app.post('/posts', createPost);
app.get('/posts/:id', getPostById);
app.delete('/posts/:id', deletePost);
app.put('/posts/:id', updatePost);
app.patch('/posts/:id', setFavorite);
app.get('/posts', getAllPosts);

// Route handler functions
async function createPost(req, res) {
    try {
        const post = req.body;

        // Check if all required fields exist and are not empty
        const missingFields = requiredFields.filter(field => {
            return !post[field] || post[field].trim() === '';
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields: missingFields
            });
        }

        if (!post['imageUrl']) {
            post['imageUrl'] = "https://picsum.photos/200?random=2";
        }

        // If validation passes, create the post
        const newPost = await postsRepo.createPost(post);
        res.status(201).json({ ...newPost });
    } catch (error) {
        res.status(500).json({ message: `Failed to create post. Got error: ${JSON.stringify(getErrorDetails(error))}` });
    }
}

async function getPostById(req, res) {
    try {
        const postId = req.params.id;
        const post = await postsRepo.getPostById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json({ ...post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve post' });
    }
}

async function deletePost(req, res) {
    try {
        const postId = req.params.id;
        const deleted = await postsRepo.deletePost(postId);
        res.status(200).json({ message: deleted ? 'Post deleted successfully': 'Post to delete not found' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete post' });
    }
}

async function updatePost(req, res) {
    try {
        const postId = req.params.id;
        const updatedPost = req.body;

        // Check if all required fields exist and are not empty
        const missingFields = requiredFields.filter(field => {
            return !updatedPost[field] || updatedPost[field].trim() === '';
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields: missingFields
            });
        }

        if (!updatedPost['imageUrl']) {
            updatedPost['imageUrl'] = "https://picsum.photos/200?random=2";
        }

        const post = await postsRepo.updatePost(postId, updatedPost);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // TODO: Implement post update logic
        res.status(200).json({ ...post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post' });
    }
}

async function setFavorite(req, res) {
    try {
        const postId = req.params.id;
        const {favorite} = req.body;

        const post = await postsRepo.setFavorite(postId, favorite);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // TODO: Implement post update logic
        res.status(200).json({ ...post });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update post' });
    }
}

async function getAllPosts(req, res) {
    try {
        const posts = await postsRepo.getAllPosts();
        res.status(201).json([ ...posts ]);
    } catch (error) {
        res.status(500).json({ message: `Failed to get all posts. Got error: ${getErrorDetails(error)}` });
    }
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
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
