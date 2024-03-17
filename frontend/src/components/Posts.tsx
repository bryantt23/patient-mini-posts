import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/patientInfo';
import Post from './Post';
const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const postsData = await fetchPosts(0, 3);
      setPosts(postsData);
    };
    loadPosts();
  }, []);

  return (
    <div>
      {posts.map(post => (
        <Post post={post} />
      ))}
    </div>
  );
};

export default Posts;
