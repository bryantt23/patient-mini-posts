import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { CardActions } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
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
    <Card variant='outlined' sx={{ mb: 2 }}>
      <CardContent>
        <Typography gutterBottom variant='h5' component='div'>
          {title}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {renderDescription()}
          {isCollapsed && post.patient_description.length > 150 && (
            <Button size='small' onClick={() => setIsCollapsed(false)}>
              See More
            </Button>
          )}
        </Typography>
        <Typography sx={{ mt: 2, mb: 1 }} color='text.secondary'>
          Created at: {formattedDate}
        </Typography>
        <CommentForm postId={id} onCommentAdded={handleAddComment} />
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        <Button
          startIcon={<FavoriteIcon />}
          onClick={handleHug}
          color={alreadyHugged ? 'error' : 'secondary'}
          sx={{
            mr: 1,
            border: '1px solid',
            borderColor: alreadyHugged ? 'error.main' : 'secondary.main',
            '&:hover': {
              border: '1px solid',
              borderColor: alreadyHugged ? 'error.dark' : 'secondary.dark'
            }
          }}
        >
          {hugCount}
        </Button>

        <Button
          startIcon={<ExpandMoreIcon />}
          onClick={() => setCommentsVisible(!commentsVisible)}
          aria-expanded={commentsVisible}
          aria-label='show comments'
          sx={{
            border: '1px solid',
            borderColor: 'primary.main',
            '&:hover': {
              border: '1px solid',
              borderColor: 'primary.dark'
            }
          }}
        >
          {commentsCount > 0
            ? commentsVisible
              ? `Hide ${commentsCount} comments`
              : `Show ${commentsCount} comments`
            : 'No comments yet'}
        </Button>
      </CardActions>

      <Collapse in={commentsVisible} timeout='auto' unmountOnExit>
        <CardContent>
          {nestedComments.map(comment => (
            <Comment
              key={comment.id}
              comment={comment}
              onReply={handleAddComment}
              level={0}
            />
          ))}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default Post;
