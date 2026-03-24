import { Request, Response, NextFunction } from "express";
import { createIssue as createIssueService, getIssueById as getIssueByIdService, getIssueByUserId as getIssueByUserIdService } from "./issues.service";
import { CreateIssueData } from "./issues.repository";

export function createIssue(req: Request, res: Response, next: NextFunction) {
    return (async () => {
        const { title, description, priority, labels, assigneeId } = req.body;
        const creatorId = req.userId!;
        const result = await createIssueService({ title, description, priority, labels, assigneeId, creatorId });
        res.status(201).json({ success: true, data: result });
    })().catch(next);
}   

export function getIssueByUserId(req: Request, res: Response, next: NextFunction) {
    return (async () => {
        const userId = req.userId!;
        const result = await getIssueByUserIdService(userId);
        res.json({ success: true, data: result });
    })().catch(next);
}

export function getIssueById(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    return (async () => {
        const id = req.params.id;
        if (isNaN(parseInt(id, 10))) {
            return res.status(400).json({ success: false, message: "Invalid issue ID" });
        }
        const issueId = parseInt(id, 10);
        const result = await getIssueByIdService(issueId);
        if (!result) {
            return res.status(404).json({ success: false, message: "Issue not found" });
        }
        res.json({ success: true, data: result });
    })().catch(next);
}