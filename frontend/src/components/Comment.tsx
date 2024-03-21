import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import { CommentProps } from '../types';
import CommentForm from './CommentForm'; // Ensure you have this import

const Comment: React.FC<CommentProps> = ({ comment, onReply, level }) => {
  const [isReplying, setIsReplying] = useState(false);
  const { id, display_name, text, replies, created_at } = comment;
  const indentStyle = { marginLeft: `${level * 50}px` }; // Adjust indentation for visual hierarchy
  const formattedDate = formatDistanceToNow(new Date(created_at), {
    addSuffix: true
  });

  const handleReplyClick = () => {
    setIsReplying(true);
  };

  const handleAddComment = async (text: string) => {
    await onReply(text, id);
    setIsReplying(false);
  };

  return (
    <div style={indentStyle}>
      <p>
        {display_name}: {text}
      </p>{' '}
      <p>Created at: {formattedDate}</p>
      {/* Only show the Reply button if the comment is not already two levels deep */}
      {level < 1 && <button onClick={handleReplyClick}>Reply</button>}
      {isReplying && (
        <CommentForm
          postId={comment.postId} // This needs adjustment to ensure you pass the correct postId
          parentId={id}
          onCommentAdded={handleAddComment}
        />
      )}
      {replies?.map(reply => (
        <Comment
          key={reply.id}
          comment={reply}
          onReply={onReply}
          level={level + 1} // Increase level for nested comments
        />
      ))}
    </div>
  );
};

export default Comment;
