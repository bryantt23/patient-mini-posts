import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/patientInfo';

const Posts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const loadPosts = async () => {
      const postsData = await fetchPosts();
      setPosts(postsData);
    };
    loadPosts();
  }, []);

  return <div>{JSON.stringify(posts)}</div>;
};

export default Posts;
