import prisma from "../lib/prisma";
import { Comment, Issue, Prisma, User } from "../generated/prisma";

export interface CreateIssueData {
    title: string;
    priority: Issue["priority"];
    creatorId: number;
    description?: string; 
    assigneeId?: number;
}

export async function createIssue(data: CreateIssueData): Promise<Issue> {
    return await prisma.issue.create({
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            creatorId: data.creatorId,
            assigneeId: data.assigneeId,
        },
    });
}

export async function getIssueByUserId(userId: number): Promise<(Issue & { creator: Pick<User, "id" | "name" | "email"> })[]> {
    return await prisma.issue.findMany({
        orderBy: { createdAt: "desc" },
        where: {
            OR: [
                { creatorId: userId },
                { assigneeId: userId },
            ],
        },
        include: { 
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
        },
    });
}

export async function getIssueById(issueId: number): Promise<(Issue & { creator: Pick<User, "id" | "name" | "email">, comments: Comment[] }) | null> {
    return await prisma.issue.findUnique({
        where: { id: issueId },
        include: { 
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            comments: true 
        }
    });
}

export async function deleteIssue(issueId: number): Promise<void> {
    await prisma.issue.delete({
        where: { id: issueId },
    });
}

export async function updateIssue(issueId: number, data: Partial<CreateIssueData>): Promise<Issue> {
    return await prisma.issue.update({
        where: { id: issueId },
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            assigneeId: data.assigneeId,
        },
    });
}

export async function updateIssueStatus(issueId: number, status: Issue["status"]): Promise<Issue> {
    return await prisma.issue.update({
        where: { id: issueId },
        data: {
            status,
        },
    });
}

export async function queryIssuesList(
    userId: number, 
    filters: {
        status?: Issue["status"]; 
        priority?: Issue["priority"]; 
        page: number; 
        limit: number; 
    }): Promise<{ issues: (Issue & { creator: Pick<User, "id" | "name" | "email"> })[]; total: number }> {
    const whereClause: Prisma.IssueWhereInput = {
        OR: [
            { creatorId: userId },
            { assigneeId: userId },
        ],
    };

    if (filters.status) {
        whereClause.status = filters.status;
    }
    if (filters.priority) {
        whereClause.priority = filters.priority;
    }

    const [issues, total] = await Promise.all([
        prisma.issue.findMany({
            where: whereClause,
            skip: (filters.page - 1) * filters.limit,
            take: filters.limit,
            include: { 
                creator: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
            },
        }),
        prisma.issue.count({ where: whereClause }),
    ]);

    return { issues, total };
}