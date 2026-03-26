import { Comment, Issue, User } from "../generated/prisma";
import prisma from "../lib/prisma";

export async function createComment(issueId: Issue["id"], authorId: User["id"], content: string): Promise<Comment> {
    return await prisma.comment.create({
        data: {
            content,
            issueId,
            authorId,
        },
    });
}

export async function getCommentsByIssueId(issueId: Issue["id"]): Promise<Comment[]> {
    return await prisma.comment.findMany({
        where: { issueId },
    });
}

export async function getCommentById(commentId: Comment["id"]): Promise<Comment | null> {
    return await prisma.comment.findUnique({
        where: { id: commentId },
    });
}

export async function updateComment(commentId: Comment["id"], content: string): Promise<Comment> {
    return await prisma.comment.update({
        where: { id: commentId },
        data: { content },
    });
}

export async function deleteComment(commentId: Comment["id"]): Promise<void> {
    await prisma.comment.delete({
        where: { id: commentId },
    });
}
