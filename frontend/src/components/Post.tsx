import React, { useState } from 'react';
import { givePostHug } from '../services/patientInfo';

interface Comment {
  id: number;
  parent_id: number | null;
  display_name: string;
  text: string;
  created_at: string;
}

interface PostProps {
  post: {
    id: string;
    title: string;
    patient_description: string;
    created_at: string;
    num_hugs: number;
    comments?: Record<string, Comment>;
  };
}

const Post: React.FC<PostProps> = ({ post }) => {
  const { id, title, patient_description, created_at, num_hugs } = post;
  const [alreadyHugged, setAlreadyHugged] = useState(false);
  const [hugCount, setHugCount] = useState(num_hugs);

  const handleHug = async () => {
    if (!alreadyHugged) {
      await givePostHug(id);
      setAlreadyHugged(true);
      setHugCount(prevCount => prevCount + 1);
    }
  };

  const shortenedDescription =
    patient_description.length > 100
      ? `${patient_description.substring(0, 97)}...`
      : patient_description;

  return (
    <div>
      <h2>{title}</h2>
      <p>{shortenedDescription}</p>
      <p>Created at: {created_at}</p>
      <button onClick={handleHug} disabled={alreadyHugged}>
        {hugCount} Hugs
      </button>
      <p>{JSON.stringify(post.comments)}</p>
    </div>
  );
};

export default Post;
