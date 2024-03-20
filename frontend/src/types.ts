export interface IComment {
    postId: string;
    id: number;
    parent_id: number | null;
    display_name: string;
    text: string;
    created_at: string;
    replies?: IComment[];
}

export interface IPost {
    id: string;
    title: string;
    patient_description: string;
    created_at: string;
    num_hugs: number;
    comments?: Record<string, IComment>;
}

export interface PostProps {
    post: IPost;
}

export interface CommentData {
    display_name: string;
    text: string;
    parentId?: number | null;
}

export interface CommentFormProps {
    postId: string;
    parentId?: number | null;
    onCommentAdded: (text: string, parentId?: number | null) => void; // Adjust the type of comment according to your needs
}

export interface CommentProps {
    comment: IComment;
    onReply: (text: string, parentId?: number | null) => Promise<void>;
    level: number;
}