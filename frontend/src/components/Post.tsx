import { formatDistanceToNow } from 'date-fns';
import _ from 'lodash';
import React, { useState } from 'react';
import { addCommentToPost, givePostHug } from '../services/patientInfo';
import { IComment, PostProps } from '../types';
import { addCommentToComment, nestComments } from '../utils/commentUtils';
import Comment from './Comment';
import CommentForm from './CommentForm';

const Post: React.FC<PostProps> = ({ post }) => {
  const { id, title, created_at, num_hugs, comments } = post;
  const [alreadyHugged, setAlreadyHugged] = useState(false);
  const [hugCount, setHugCount] = useState(num_hugs);
  const initialComments: IComment[] = comments ? Object.values(comments) : [];
  const initialNestedComments = nestComments(initialComments);
  const [nestedComments, setNestedComments] = useState<IComment[]>(
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
      setHugCount((prevCount: number) => prevCount + 1);
    }
  };

  const formattedDate = formatDistanceToNow(new Date(created_at), {
    addSuffix: true
  });
  const handleAddComment = async (text: string, parentId?: number | null) => {
    const newCommentData = {
      display_name: 'Logged in user',
      text,
      parent_id: parentId || null
    };

    try {
      const newComment = await addCommentToPost(id, newCommentData);
      if (newComment && newComment.comment) {
        const updatedComments = _.cloneDeep(nestedComments);
        // add comment to post
        if (!parentId) {
          updatedComments.push(newComment.comment);
        } else {
          addCommentToComment(updatedComments, newComment.comment, parentId);
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
      <p>Created at: {formattedDate}</p>
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
