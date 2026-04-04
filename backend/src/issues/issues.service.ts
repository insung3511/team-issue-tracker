import { 
    createIssue as createIssueRepo, 
    getIssueById as getIssueByIdRepo, 
    getIssueByUserId as getIssueByUserIdRepo,
    deleteIssue as deleteIssueRepo,
    updateIssue as updateIssueRepo,
    updateIssueStatus as updateIssueStatusRepo,
    queryIssuesList as queryIssuesListRepo
} from "./issues.repository";
import { Comment, Issue, User } from "../generated/prisma";
import { CreateIssueData } from "./issues.repository";
import { AppError } from "../errors/AppError";

export async function createIssue(data: CreateIssueData): Promise<Issue> {
    return await createIssueRepo(data);
}

export async function getIssueByUserId(id: number): Promise<(Issue & { creator: Pick<User, "id" | "name" | "email"> })[]> {
    return await getIssueByUserIdRepo(id);
}

export async function getIssueById(id: number): Promise<(Issue & { creator: Pick<User, "id" | "name" | "email">, comments: Comment[] }) | null> {
    return await getIssueByIdRepo(id);
}

export async function deleteIssue(id: number): Promise<void> {
    await deleteIssueRepo(id);
}

export async function updateIssue(id: number, data: Partial<CreateIssueData>): Promise<Issue> {
    return await updateIssueRepo(id, data);
}

export async function updateIssueStatus(id: number, status: Issue["status"]): Promise<Issue> {
    return await updateIssueStatusRepo(id, status);
}

export async function updateIssueStatusByRule(issue: Issue, reqStatus: Issue["status"]): Promise<Issue> {
    const issueStatusRecord: Record<Issue["status"], Issue["status"][]> = {
        "BACKLOG": ["TODO"],
        "TODO": ["IN_PROGRESS"],
        "IN_PROGRESS": ["IN_REVIEW"],
        "IN_REVIEW": ["DONE"],
        "DONE": ["IN_PROGRESS"]
    };

    const nextStatus = issueStatusRecord[issue.status];
    if (!nextStatus || !nextStatus.includes(reqStatus)) {
            throw new AppError(400, "Invalid status transition", { 
            currentStatus: issue.status, 
            requestedStatus: reqStatus,
            allowedTransitions: issueStatusRecord[issue.status] || []
        });
    }

    return await updateIssueStatusRepo(issue.id, reqStatus);
}

export async function queryIssuesList(
    userId: number, 
    filters: {
        status?: Issue["status"];
        priority?: Issue["priority"];
        page: number;
        limit: number;
    }): Promise<{
        issues: (Issue & { creator: Pick<User, "id" | "name" | "email"> })[]; 
        pagination: { page: number; limit: number; total: number; totalPages: number }
    }> {
    const data = await queryIssuesListRepo(userId, filters);

    const totalPage = Math.ceil(data.total / filters.limit);
    if (filters.page > totalPage) {
        throw new AppError(400, "Page number exceeds total pages", { 
            requestedPage: filters.page, 
            totalPages: totalPage 
        });
    }

    // result should be { pagination: {page, limit, total, totalPages } } 
    const result = {
        issues: data.issues,
        pagination: {
            page: filters.page,
            limit: filters.limit,
            total: data.total,
            totalPages: totalPage
        }
    }

    return result;
}