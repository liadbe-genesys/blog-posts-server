# Blog Posts Server

## Environment Setup
1. Install node - v20.15.1 (LTS) - https://nodejs.org/en/download/prebuilt-installer.
2. Install git - https://github.com/git-guides/install-git.
3. Download VS Code IDE - https://code.visualstudio.com/download (or any other IDE of your preference).

## Project Installation
1. Clone the repository - `git clone https://github.com/liadbe-genesys/blog-posts-server.git`.
2. In your IDE:
    1. Open the project folder.
    2. Navigate to Terminal menu, and open new terminal.
3. In the terminal:
    1. Run `npm install`.
    2. Run `npm start` and open the browser on http://localhost:3000/.


## Workshop Instructions
Implement the API functions for the following endpoints:

### Get Post by ID (GET /posts/:id)
1. Get the post by invoking the PostRepository function using the ID provided in the url.
2. If the post was found, return it with a 200 status code
3. If it wasn't found, return a 404 status code with an appropriate message

### Create Post (POST /posts)
1. Extract the details of the post to create from the request body
2. Verify that the required properties exist:
    ```json
    {
        "title": "string",
        "href": "string", 
        "description": "string",
        "category": "string"
    }
3. If any of the properties is missing, return a 400 status code with an appropriate message
4. If the "imageUrl" property doesn't exist, add a random image url to the parameters(e.g. "https://picsum.photos/200?random=2")
5. Invoke the PostRepository function to create the post, and return a 201 status code with the created post as a response.

### Delete Post (DELETE /posts/:id)
1. Invoke the PostRepository function to delete the post, using the ID provided in the url
2. Send a response with a 200 status code. Add an appropriate message to show if the post was deleted successfully or if it wasn't found

### Update Post (PUT /posts/:id)
1. Extract the details of the post to create from the request body
2. Verify that the required properties exist:
    ```json
    {
        "title": "string",
        "href": "string", 
        "description": "string",
        "category": "string"
    }
3. If any of the properties is missing, return a 400 status code with an appropriate message.
4. Invoke the PostRepository function to update the post, using the ID from the url, and the body of the request.
5. If the post wasn't found, return a 404 status code with an appropriate message.
6. Otherwise, return a 200 status code with the updated post object.