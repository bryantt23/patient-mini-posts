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
    try {
        const response = await axios.get(JSON_SERVER_URL);
        console.log("🚀 ~ app.get ~ response:", response)
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).send('An error occurred fetching the posts');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
