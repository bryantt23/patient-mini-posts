import { cloneDeep } from "lodash";
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

export const addNestedComment = (
    nestedComments: IComment[],
    newComment: IComment,
    parentId?: number | null
): IComment[] => {
    const updatedComments = cloneDeep(nestedComments);
    if (parentId === null || parentId === undefined) {
        // If parentId is null or undefined, add the comment to the top level
        updatedComments.push(newComment);
    } else {
        // Otherwise, find the parent and add the new comment to its replies
        const findAndAddComment = (comments: IComment[]): boolean => {
            for (const comment of comments) {
                if (comment.id === parentId) {
                    if (!comment.replies) {
                        comment.replies = [];
                    }
                    comment.replies.push(newComment);
                    return true; // Stop the search as we've added the comment
                }
                // If the current comment has replies, search them too
                if (comment.replies && findAndAddComment(comment.replies)) {
                    return true; // Stop the search as we've added the comment
                }
            }
            return false; // Comment not found at this level
        };

        findAndAddComment(updatedComments);
    }
    return updatedComments;
};