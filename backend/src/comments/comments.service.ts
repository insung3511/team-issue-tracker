import { 
    createComment as createCommentRepo,
    getCommentById as getCommentByIdRepo,
    getCommentsByIssueId as getCommentsByIssueIdRepo,
    updateComment as updateCommentRepo,
    deleteComment as deleteCommentRepo
} from "./comments.repository";
import { Comment } from "../generated/prisma";

export async function createComment(issueId: number, authorId: number, content: string): Promise<Comment> {
    return await createCommentRepo(issueId, authorId, content);
}

export async function getCommentById(commentId: number): Promise<Comment | null> {
    return await getCommentByIdRepo(commentId);
}

export async function getCommentsByIssueId(issueId: number): Promise<Comment[]> {
    return await getCommentsByIssueIdRepo(issueId);
}

export async function updateComment(commentId: number, content: string): Promise<Comment> {
    return await updateCommentRepo(commentId, content);
}

export async function deleteComment(commentId: number): Promise<void> {
    await deleteCommentRepo(commentId);
}