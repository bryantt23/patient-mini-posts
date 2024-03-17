const axios = require('axios')
const express = require('express');

const app = express();
const PORT = 3000;
const JSON_SERVER_URL = 'http://localhost:3001/posts'

app.use(express.json());

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



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
