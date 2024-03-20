import { IComment } from "../types";

export const nestComments = (commentList: IComment[]): IComment[] => {
    const commentMap: { [key: string]: IComment } = {};

    // Step 1: Create a map of id -> comment.
    commentList.forEach(comment => {
        commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Step 2: Nest the comments.
    Object.values(commentMap).forEach(comment => {
        if (comment.parent_id !== null) {
            const parent = commentMap[comment.parent_id];
            if (parent) {
                parent.replies?.push(comment);
            }
        }
    });

    // Step 3: Extract the top-level comments.
    return Object.values(commentMap).filter(
        comment => comment.parent_id === null
    );
};

export const addCommentToComment = (
    comments: IComment[],
    newComment: IComment,
    parentId?: number | null
): void => {
    const findAndAddComment = (comments: IComment[]) => {
        comments.forEach(comment => {
            if (comment.id === parentId) {
                if (!comment.replies) comment.replies = [];
                comment.replies.push(newComment);
            } else if (comment.replies) {
                findAndAddComment(comment.replies);
            }
        });
    };
    findAndAddComment(comments);
};