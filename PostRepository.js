const fs = require('fs').promises;
const csv = require('csv-parse/sync');
const { stringify } = require('csv-stringify/sync');

class PostRepository {
    constructor() {
        this.filePath = './data/posts.csv';
        this.headers = ['id','title','href','description','category','imageUrl','favorite','review'];
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
            // id,title,href,description,category,imageUrl,favorite,review
            const newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
            
            const newPost = {
                id: this.padWithZeroes(newId),
                title: post.title,
                href: post.href,
                description: post.description,
                category: post.category,
                imageUrl: post.imageUrl,
                favorite: false,
                review: 0
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
            throw new Error(`Failed to get post: ${JSON.stringify(this.getErrorDetails(error), null, 2)}`);
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
            throw new Error(`Failed to delete post: ${JSON.stringify(this.getErrorDetails(error), null, 2)}`);
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
            throw new Error(`Failed to update post: ${JSON.stringify(this.getErrorDetails(error), null, 2)}`);
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
            throw new Error(`Failed to get posts: ${JSON.stringify(this.getErrorDetails(error), null, 2)}`);
        }
    }

    async savePosts(posts) {
        try {
            const csvContent = stringify(posts, { header: true, columns: this.headers });
            await fs.writeFile(this.filePath, csvContent);
        } catch (error) {
            throw new Error(`Failed to save posts: ${JSON.stringify(this.getErrorDetails(error), null, 2)}`);
        }
    }

    padWithZeroes(id) {
        const digits = stringify(id).length;
        const padding = 3 - digits;
        return '0'.repeat(padding) + id;
    }

    getErrorDetails(error) {
        return {
            message: error.message,
            stack: error.stack,
            code: error.code, // Useful for file system errors
            name: error.name
        };
    }
}

module.exports = PostRepository;
