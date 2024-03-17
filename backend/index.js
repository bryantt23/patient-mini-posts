const axios = require('axios')
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;
const JSON_SERVER_URL = 'http://localhost:3001/posts'

app.use(express.json());
app.use(cors());

app.get('/hello', (req, res) => {
    res.send('Hello World!');
});

app.get('/posts', async (req, res) => {
    const start = req.query.start || 1;
    const limit = req.query.limit || 10;
    try {
        const url = `${JSON_SERVER_URL}?_start=${start}&_limit=${limit}`
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('An error occurred fetching the posts');
    }
});

app.put('/posts/:id/hug', async (req, res) => {
    const postId = req.params.id;

    try {
        const postResponse = await axios.get(`${JSON_SERVER_URL}/${postId}`);
        const post = postResponse.data;

        const updatedPost = {
            ...post,
            num_hugs: post.num_hugs + 1
        };
        await axios.patch(`${JSON_SERVER_URL}/${postId}`, { num_hugs: updatedPost.num_hugs });
        res.json(updatedPost);
    } catch (error) {
        console.error('Error updating post hugs:', error);
        res.status(500).send('An error occurred while updating the number of hugs');
    }
});

app.post('/posts/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    const { parent_id } = req.body;
    const newComment = {
        created_at: new Date().toISOString(), ...req.body
    };

    try {
        const url = `${JSON_SERVER_URL}/${postId}`
        const postResponse = await axios.get(url);
        const post = postResponse.data;

        if (parent_id !== undefined && parent_id !== null) {
            const parentComment = post.comments[parent_id];
            if (parentComment && parentComment.parent_id !== null) {
                return res.status(400).send('Comments cannot be nested more than two levels deep.');
            }
        }

        let maxCommentId = 0;

        if (post.comments) {
            Object.values(post.comments).forEach(comment => {
                maxCommentId = Math.max(maxCommentId, comment.id);
            });
        }

        newComment.id = maxCommentId + 1;

        const updatedComments = { ...post.comments, [newComment.id]: newComment };
        await axios.patch(`${JSON_SERVER_URL}/${postId}`, { comments: updatedComments });

        res.json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error('Error adding new comment:', error);
        res.status(500).send('An error occurred while adding the comment');
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
