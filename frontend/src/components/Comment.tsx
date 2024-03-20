import React, { useState } from 'react';
import CommentForm from './CommentForm'; // Ensure you have this import

interface CommentProps {
  comment: Comment;
  onReply: (text: string, parentId: number) => Promise<void>; // Adjusted to match the async nature
  level: number;
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, level }) => {
  const [isReplying, setIsReplying] = useState(false);
  const { id, display_name, text, replies } = comment;
  const indentStyle = { marginLeft: `${level * 50}px` }; // Adjust indentation for visual hierarchy

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
      </p>
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
