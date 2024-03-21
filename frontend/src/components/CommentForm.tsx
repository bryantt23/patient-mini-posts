import React, { useState } from 'react';
import { CommentFormProps } from '../types';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const CommentForm: React.FC<CommentFormProps> = ({
  parentId = null,
  onCommentAdded
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setIsSubmitting(true);

    // Call the passed in function prop directly
    onCommentAdded(commentText, parentId);

    // Clear the form and reset submission state
    setCommentText('');
    setIsSubmitting(false);
  };

  return (
    <Box
      component='form'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        marginTop: 2
      }}
      onSubmit={handleSubmit}
      noValidate
      autoComplete='off'
    >
      <TextField
        multiline
        rows={1}
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
        placeholder='Add a comment...'
        disabled={isSubmitting}
        variant='outlined'
        fullWidth
      />
      <Button
        type='submit'
        variant='contained'
        disabled={isSubmitting || !commentText.trim()}
        color='primary'
        sx={{ alignSelf: 'flex-end' }}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </Box>
  );
};

export default CommentForm;
