import React, { useState } from 'react';
import _ from 'lodash';
import { addCommentToPost, givePostHug } from '../services/patientInfo';
import Comment from './Comment';
import CommentForm from './CommentForm';
import { PostProps } from '../types';

const nestComments = (commentList: Comment[]): Comment[] => {
  const commentMap: { [key: string]: Comment } = {};

  // Step 1: Create a map of id -> comment.
  commentList.forEach(comment => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  // Step 2: Nest the comments.
  Object.values(commentMap).forEach(comment => {
    if (comment.parent_id !== null) {
      const parent = commentMap[comment.parent_id];
      if (parent) {
        parent.replies?.push(comment);
      }
    }
  });

  // Step 3: Extract the top-level comments.
  return Object.values(commentMap).filter(
    comment => comment.parent_id === null
  );
};

const Post: React.FC<PostProps> = ({ post }) => {
  const { id, title, patient_description, created_at, num_hugs, comments } =
    post;
  const [alreadyHugged, setAlreadyHugged] = useState(false);
  const [hugCount, setHugCount] = useState(num_hugs);
  const initialComments = comments ? Object.values(comments) : [];
  const initialNestedComments = nestComments(initialComments);
  const [nestedComments, setNestedComments] = useState<Comment[]>(
    initialNestedComments
  );
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const commentsCount = nestedComments.reduce(
    (acc, comment) => acc + (comment.replies ? comment.replies.length : 0) + 1,
    0
  );
  const toggleCommentsVisibility = () => setCommentsVisible(!commentsVisible);

  const handleHug = async () => {
    if (!alreadyHugged) {
      await givePostHug(id);
      setAlreadyHugged(true);
      setHugCount(prevCount => prevCount + 1);
    }
  };

  const handleAddComment = async (text: string, parentId?: number) => {
    const newCommentData = {
      display_name: 'Logged in user', // Update as needed
      text,
      parent_id: parentId || null
    };

    try {
      const newComment = await addCommentToPost(id, newCommentData);
      if (newComment && newComment.comment) {
        let updatedComments = _.cloneDeep(nestedComments); // Using lodash's cloneDeep
        if (!parentId) {
          updatedComments.push(newComment.comment);
        } else {
          const findAndAddComment = (comments: Comment[]) => {
            comments.forEach(comment => {
              if (comment.id === parentId) {
                if (!comment.replies) comment.replies = [];
                comment.replies.push(newComment.comment);
              } else if (comment.replies) {
                findAndAddComment(comment.replies);
              }
            });
          };
          findAndAddComment(updatedComments);
        }
        setNestedComments(updatedComments);
      }
    } catch (error) {
      console.error('Failed to add new comment:', error);
    }
  };

  const renderDescription = () => {
    return isCollapsed && post.patient_description.length > 150
      ? `${post.patient_description.substring(0, 147)}... `
      : post.patient_description;
  };

  return (
    <div>
      <h2>{title}</h2>
      <p>
        {renderDescription()}
        {isCollapsed && post.patient_description.length > 150 && (
          <span
            style={{ fontWeight: 'bold', cursor: 'pointer' }}
            onClick={() => setIsCollapsed(false)}
          >
            See More
          </span>
        )}
      </p>
      <p>Created at: {created_at}</p>
      <button onClick={handleHug} disabled={alreadyHugged}>
        {hugCount} Hugs
      </button>
      <CommentForm postId={id} onCommentAdded={handleAddComment} />
      {commentsCount > 0 ? (
        <>
          <button onClick={toggleCommentsVisibility}>
            {commentsVisible
              ? `Hide All ${commentsCount} Comments`
              : `Show All ${commentsCount} Comments`}
          </button>
          {commentsVisible &&
            nestedComments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                onReply={handleAddComment}
                level={0}
              />
            ))}
        </>
      ) : (
        <p>No comments yet.</p>
      )}
    </div>
  );
};

export default Post;
