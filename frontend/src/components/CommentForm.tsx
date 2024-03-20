import React, { useState } from 'react';
import { CommentFormProps } from '../types';

const CommentForm: React.FC<CommentFormProps> = ({
  parentId = null,
  onCommentAdded
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
    <form onSubmit={handleSubmit}>
      <textarea
        value={commentText}
        onChange={e => setCommentText(e.target.value)}
        placeholder='Add a comment...'
        disabled={isSubmitting}
      />
      <button type='submit' disabled={isSubmitting || !commentText.trim()}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default CommentForm;
