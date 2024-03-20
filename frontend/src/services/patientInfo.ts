import axios from 'axios';
import { CommentData } from '../types';

const JSON_SERVER_URL = 'http://localhost:3000/posts';

export const fetchPosts = async (start: number = 0, limit: number = 10) => {
    try {
        const response = await axios.get(`${JSON_SERVER_URL}?start=${start}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const givePostHug = async (postId: string) => {
    try {
        const response = await axios.put(`${JSON_SERVER_URL}/${postId}/hug`);
        return response.data;
    } catch (error) {
        console.error('Error updating post hugs:', error);
        throw error;
    }
};

export const addCommentToPost = async (postId: string, comment: CommentData) => {
    try {
        const response = await axios.post(`${JSON_SERVER_URL}/${postId}/comments`, comment);
        return response.data;
    } catch (error) {
        console.error('Error adding new comment:', error);
        throw error;
    }
};
