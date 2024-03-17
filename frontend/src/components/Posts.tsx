import React, { useEffect, useState } from 'react';
import { fetchPosts } from '../services/patientInfo';
import Post from './Post';
import InfiniteScroll from 'react-infinite-scroll-component';

const PAGE_SIZE = 3;
const Posts = () => {
  const [index, setIndex] = useState(0);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    const postsData = await fetchPosts(index, PAGE_SIZE);
    if (postsData.length === 0 || postsData.length < PAGE_SIZE) {
      setHasMore(false);
    } else {
      setIndex(prevIndex => prevIndex + PAGE_SIZE);
      setPosts(prevPosts => [...prevPosts, ...postsData]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        {/* {posts} */}
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Posts;
