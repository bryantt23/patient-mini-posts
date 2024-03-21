import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchPosts } from '../services/patientInfo';
import { IPost } from '../types';
import Post from './Post';
import Typography from '@mui/material/Typography';

const PAGE_SIZE = 3;
const Posts = () => {
  const [index, setIndex] = useState(0);
  const [posts, setPosts] = useState<IPost[]>([]);
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
      <Typography variant='h2' align='center' gutterBottom>
        Healthbook
      </Typography>
      <InfiniteScroll
        dataLength={posts.length} //This is important field to render the next data
        next={fetchData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen every post</b>
          </p>
        }
      >
        {posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default Posts;
