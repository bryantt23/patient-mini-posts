import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import { CommentProps } from '../types';
import CommentForm from './CommentForm';

const Comment: React.FC<CommentProps> = ({ comment, onReply, level }) => {
  const [isReplying, setIsReplying] = useState(false);
  const { id, display_name, text, replies, created_at } = comment;
  const formattedDate = formatDistanceToNow(new Date(created_at), {
    addSuffix: true
  });

  const handleReplyClick = () => setIsReplying(true);

  const handleAddComment = async (text: string) => {
    await onReply(text, id);
    setIsReplying(false);
  };

  return (
    <Box sx={{ marginLeft: `${level * 3}rem`, marginTop: 2 }}>
      <Typography variant='body1' component='p'>
        <strong>{display_name}</strong>: {text}
      </Typography>
      <Typography variant='caption' component='p' sx={{ mb: 1 }}>
        Created: {formattedDate}
      </Typography>
      {/* Only show the Reply button if the comment is not already two levels deep */}
      {level < 1 && (
        <Button variant='text' size='small' onClick={handleReplyClick}>
          Reply
        </Button>
      )}
      {isReplying && (
        <CommentForm
          postId={comment.postId} // Ensure you pass the correct postId
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
    </Box>
  );
};

export default Comment;
