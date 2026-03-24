import { Request, Response, NextFunction } from "express";
import { createIssue as createIssueService, getIssueById as getIssueByIdService, getIssueByUserId as getIssueByUserIdService } from "./issues.service";
import { AppError } from "../errors/AppError";

export async function createIssue(req: Request, res: Response, next: NextFunction) {
    try {
        const { title, description, priority, labels, assigneeId } = req.body;
        const creatorId = req.userId!;
        const result = await createIssueService({ title, description, priority, labels, assigneeId, creatorId });
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getIssueByUserId(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId!;
        const result = await getIssueByUserIdService(userId);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function getIssueById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const issueId = parseInt(id, 10);
        if (isNaN(issueId)) {
            throw new AppError(400, "Invalid issue ID");
        }

        const result = await getIssueByIdService(issueId);
        if (!result) {
            throw new AppError(404, "Issue not found");
        }

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}