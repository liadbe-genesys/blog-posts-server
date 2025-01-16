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
app.get('/posts', getAllPosts);

// Route handler functions
async function getPostById(req, res) {
    /* 
    TODO: Implement this function to do the following:
        1. Get the post by invoking the PostRepository function using the ID provided in the url.
        2. If the post was found, return it with a 200 status code
        3. If it wasn't found, return a 404 status code with an appropriate message
    */
   res.status(501).json( {message: 'This function is not implemented yet!'} );
}

async function createPost(req, res) {
    /* 
    TODO: Implement this function to do the following:
        1. Extract the details of the post to create from the request body
        2. Verify that the required properties exist: "title", "href", "description", "category"
        3. If any of the properties is missing, return a 400 status code with an appropriate message
        4. If the "imageUrl" property doesn't exist, add a random image url to the parameters(e.g. "https://picsum.photos/200?random=2")
        5. Invoke the PostRepository function to create the post, and return a 201 status code with the created post as a response.
    */
   res.status(501).json( {message: 'This function is not implemented yet!'} );
}

async function deletePost(req, res) {
    /* 
    TODO: Implement this function to do the following:
        1. Get the post by invoking the PostRepository function using the ID provided in the url.
        2. If the post was found, return it with a 200 status code
        3. If it wasn't found, return a 404 status code with an appropriate message
    */
   res.status(501).json( {message: 'This function is not implemented yet!'} );
}

async function updatePost(req, res) {
    /* 
    TODO: Implement this function to do the following:
        1. Extract the details of the post to create from the request body
        2. Verify that the required properties exist: "title", "href", "description", "category"
        3. If any of the properties is missing, return a 400 status code with an appropriate message.
        4. Invoke the PostRepository function to update the post, using the ID from the url, and the body of the request.
        5. If the post wasn't found, return a 404 status code with an appropriate message.
        6. Otherwise, return a 200 status code with the updated post object.
    */
   res.status(501).json( {message: 'This function is not implemented yet!'} );
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
