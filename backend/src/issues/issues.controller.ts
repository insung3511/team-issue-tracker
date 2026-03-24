import { Request, Response, NextFunction } from "express";
import { createIssue as createIssueService } from "./issues.service";

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title, description, priority, labels, assigneeId } = req.body;
        const creatorId = req.userId!;
        const result = await createIssueService(title, priority, creatorId, description, labels, assigneeId);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};