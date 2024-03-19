interface CommentProps {
  comment: Comment;
  onReply: (parentId: number) => void; // Function to handle reply action
  level: number; // Current nesting level to control indentation
}

const Comment: React.FC<CommentProps> = ({ comment, onReply, level }) => {
  console.log('🚀 ~ level:', level);
  const { id, parent_id, display_name, text, created_at, replies } = comment;
  const indentStyle = { marginLeft: `${level * 50}px` }; // Adjust indentation based on level

  return (
    <div style={indentStyle}>
      <p>
        {display_name}: {text}
      </p>
      <button onClick={() => onReply(id)}>Reply</button>
      {replies &&
        replies.map(reply => (
          <Comment
            key={reply.id}
            comment={reply}
            onReply={onReply}
            level={level + 1}
          />
        ))}
    </div>
  );
};

export default Comment;
