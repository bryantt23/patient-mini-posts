import React, { useState } from 'react';
import { addCommentToPost, givePostHug } from '../services/patientInfo';
import Comment from './Comment';
import CommentForm from './CommentForm';

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

const nestComments = commentList => {
  const commentMap = {};

  // Step 1: Create a map of id -> comment.
  commentList.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Step 2: Nest the comments.
  Object.values(commentMap).forEach(comment => {
    if (comment.parent_id !== null) {
      const parent = commentMap[comment.parent_id];
      if (parent) {
        parent.replies.push(comment);
      }
    }
  });

  // Step 3: Extract the top-level comments.
  const nestedComments = Object.values(commentMap).filter(
    comment => comment.parent_id === null
  );

  return nestedComments;
};

const Post: React.FC<PostProps> = ({ post }) => {
  const { id, title, patient_description, created_at, num_hugs, comments } =
    post;
  const [alreadyHugged, setAlreadyHugged] = useState(false);
  const [hugCount, setHugCount] = useState(num_hugs);
  const initialNestedComments = nestComments(Object.values(comments));
  const [nestedComments, setNestedComments] = useState<Comment[]>(
    initialNestedComments
  );

  const handleHug = async () => {
    if (!alreadyHugged) {
      await givePostHug(id);
      setAlreadyHugged(true);
      setHugCount(prevCount => prevCount + 1);
    }
  };

  const handleAddComment = async (text: string, parentId?: number) => {
    // Prepare comment data
    const newCommentData = {
      display_name: 'Logged in user', // Update as needed
      text: text,
      parent_id: parentId || null
    };

    try {
      const newComment = await addCommentToPost(id, newCommentData);
      if (newComment) {
        // If the comment is successfully added, update nestedComments state
        // debugger;
        const updatedComments = [...nestedComments];
        if (parentId === null || parentId === undefined) {
          // Add new comment at the top level
          updatedComments.push(newComment.comment);
        } else {
          // Find the parent comment and add this new comment as a reply
          // This logic will depend on how you're structuring replies in your state
        }
        setNestedComments(updatedComments);
      }
    } catch (error) {
      console.error('Failed to add new comment:', error);
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
      <CommentForm postId={id} onCommentAdded={handleAddComment} />
      {comments &&
        nestedComments.map(comment => {
          console.log('🚀 ~ comment:', comment);
          return (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleAddComment}
              level={0}
            />
          );
        })}
    </div>
  );
};

export default Post;
