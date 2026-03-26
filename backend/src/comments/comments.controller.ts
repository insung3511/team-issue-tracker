import { Request, Response, NextFunction } from "express";
import {
    createComment as createCommentService,
    getCommentById as getCommentByIdService,
    getCommentsByIssueId as getCommentsByIssueIdService,
    updateComment as updateCommentService,
    deleteComment as deleteCommentService
} from "./comments.service";
import { AppError } from "../errors/AppError";

export async function createComment(req: Request<{ issueId: string; content: string }>, res: Response, next: NextFunction) {
    try {
        const issueId = parseInt(req.params.issueId, 10);
        if (isNaN(issueId)) {
            throw new AppError(400, "Invalid issue ID");
        }
        const { content } = req.body;
        const authorId = req.userId!;
        const result = await createCommentService(issueId, authorId, content);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getCommentById(req: Request<{ commentId: string }>, res: Response, next: NextFunction) {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        if (isNaN(commentId)) {
            throw new AppError(400, "Invalid comment ID");
        }

        const result = await getCommentByIdService(commentId);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getCommentsByIssueId(req: Request<{ issueId: string }>, res: Response, next: NextFunction) {
    try {
        const issueId = parseInt(req.params.issueId, 10);
        if (isNaN(issueId)) {
            throw new AppError(400, "Invalid issue ID");
        }

        const result = await getCommentsByIssueIdService(issueId);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function updateComment(req: Request<{ commentId: string }>, res: Response, next: NextFunction) {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        if (isNaN(commentId)) {
            throw new AppError(400, "Invalid comment ID");
        } 
        const { content } = req.body;

        const comment = await getCommentByIdService(commentId);
        if (!comment) {
            throw new AppError(404, "Comment not found");
        }
        if (comment.authorId !== req.userId) {
            throw new AppError(403, "You are not the author of this comment");
        }

        const result = await updateCommentService(commentId, content);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function deleteComment(req: Request<{ commentId: string }>, res: Response, next: NextFunction) {
    try {
        const commentId = parseInt(req.params.commentId, 10);
        if (isNaN(commentId)) {
            throw new AppError(400, "Invalid comment ID");
        }

        const comment = await getCommentByIdService(commentId);
        if (!comment) {
            throw new AppError(404, "Comment not found");
        }
        if (comment.authorId !== req.userId) {
            throw new AppError(403, "You are not the author of this comment");
        }

        await deleteCommentService(commentId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
} 