export interface Comment {
    id: number;
    parent_id: number | null;
    display_name: string;
    text: string;
    created_at: string;
    replies?: Comment[];
}

export interface PostProps {
    post: {
        id: string;
        title: string;
        patient_description: string;
        created_at: string;
        num_hugs: number;
        comments?: Record<string, Comment>;
    };
}

export interface CommentFormProps {
    postId: string;
    parentId?: number | null;
    onCommentAdded: (text: string, comment: any) => void; // Adjust the type of comment according to your needs
}

export interface CommentProps {
    comment: Comment;
    onReply: (text: string, parentId: number) => Promise<void>; // Adjusted to match the async nature
    level: number;
}

export interface Comment {
    parent_id?: number | null;
    text: string;
    display_name: string;
}
