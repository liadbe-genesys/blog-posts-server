const fs = require('fs').promises;
const csv = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

class PostRepository {
    constructor() {
        this.filePath = './data/posts.csv';
        this.headers = ['id', 'title', 'content', 'author', 'createdAt'];
    }

    async initialize() {
        try {
            // Check if directory exists, if not create it
            await fs.mkdir('./data', { recursive: true });
            
            // Check if file exists, if not create it with headers
            try {
                await fs.access(this.filePath);
            } catch {
                await fs.writeFile(this.filePath, this.headers.join(',') + '\n');
            }
        } catch (error) {
            throw new Error('Failed to initialize repository');
        }
    }

    async createPost(post) {
        try {
            const posts = await this.getAllPosts();
            const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
            
            const newPost = {
                id: newId,
                title: post.title,
                content: post.content,
                author: post.author,
                createdAt: new Date().toISOString()
            };

            posts.push(newPost);
            await this.savePosts(posts);
            return newPost;
        } catch (error) {
            throw new Error('Failed to create post');
        }
    }

    async getPostById(id) {
        try {
            const posts = await this.getAllPosts();
            return posts.find(post => post.id === parseInt(id)) || null;
        } catch (error) {
            throw new Error('Failed to get post');
        }
    }

    async deletePost(id) {
        try {
            const posts = await this.getAllPosts();
            const filteredPosts = posts.filter(post => post.id !== parseInt(id));
            
            if (posts.length === filteredPosts.length) {
                return false; // Post not found
            }
            
            await this.savePosts(filteredPosts);
            return true;
        } catch (error) {
            throw new Error('Failed to delete post');
        }
    }

    async updatePost(id, updatedPost) {
        try {
            const posts = await this.getAllPosts();
            const index = posts.findIndex(post => post.id === parseInt(id));
            
            if (index === -1) {
                return null;
            }

            posts[index] = {
                ...posts[index],
                ...updatedPost,
                id: parseInt(id) // Ensure ID doesn't change
            };

            await this.savePosts(posts);
            return posts[index];
        } catch (error) {
            throw new Error('Failed to update post');
        }
    }

    async getAllPosts() {
        try {
            const fileContent = await fs.readFile(this.filePath, 'utf-8');
            const records = csv.parse(fileContent, {
                columns: true,
                skip_empty_lines: true
            });
            
            return records.map(record => ({
                ...record,
                id: parseInt(record.id)
            }));
        } catch (error) {
            throw new Error('Failed to get posts');
        }
    }

    async savePosts(posts) {
        try {
            const csvContent = stringify(posts, { header: true, columns: this.headers });
            await fs.writeFile(this.filePath, csvContent);
        } catch (error) {
            throw new Error('Failed to save posts');
        }
    }
}

module.exports = PostRepository;
