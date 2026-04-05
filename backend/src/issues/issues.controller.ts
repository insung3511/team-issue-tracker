import { Request, Response, NextFunction } from "express";
import { 
    createIssue as createIssueService, 
    getIssueById as getIssueByIdService, 
    deleteIssue as deleteIssueService,
    updateIssue as updateIssueService,
    updateIssueStatus as updateIssueStatusByRuleService,
    queryIssuesList as queryIssuesListService
} from "./issues.service";
import { AppError } from "../errors/AppError";
import { issueListQuerySchema } from "./issue.schema";

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

export async function deleteIssue(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const issueId = parseInt(id, 10);
        if (isNaN(issueId)) {
            throw new AppError(400, "Invalid issue ID");
        }

        const issue = await getIssueByIdService(issueId);
        if (!issue) {
            throw new AppError(404, "Issue not found");
        }
        
        if (req.userId !== issue.creatorId) {
            throw new AppError(403, "You are not the creator of this issue");
        }

        await deleteIssueService(issueId);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}

export async function updateIssue(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const issueId = parseInt(id, 10);
        if (isNaN(issueId)) {
            throw new AppError(400, "Invalid issue ID");
        }

        const issue = await getIssueByIdService(issueId);
        if (!issue) {
            throw new AppError(404, "Issue not found");
        }

        if (req.userId !== issue.creatorId) {
            throw new AppError(403, "You are not the creator of this issue");
        }

        const { title, description, priority, labels, assigneeId } = req.body;
        const result = await updateIssueService(issueId, { title, description, priority, labels, assigneeId });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function updateIssueStatus(req: Request<{ id: string }>, res: Response, next: NextFunction) {
    try {
        const id = req.params.id;
        const issueId = parseInt(id, 10);
        if (isNaN(issueId)) {
            throw new AppError(400, "Invalid issue ID");
        }

        const issue = await getIssueByIdService(issueId);
        if (!issue) {
            throw new AppError(404, "Issue not found");
        }

        if (req.userId !== issue.creatorId) {
            throw new AppError(403, "You are not the creator of this issue");
        }
        
        const result = await updateIssueStatusByRuleService(issue, req.body.status);
        res.json({ success: true, data: result });

    } catch (error) {
        next(error);
    }
}

export async function queryIssuesList(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = req.userId!;
        const parsed = issueListQuerySchema.parse(req.query);
        const filters = { 
            status: parsed.status, 
            priority: parsed.priority,
            page: parsed.page,
            limit: parsed.limit
        }; 

        const result = await queryIssuesListService(userId, filters);
        res.json({ 
            success: true, 
            data: result.issues,
            pagination: result.pagination, 
        });
    } catch (error) {
        next(error);
    }
}