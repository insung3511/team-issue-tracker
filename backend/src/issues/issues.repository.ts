import prisma from "../lib/prisma";
import { Issue } from "../generated/prisma";

export interface CreateIssueData {
    title: string;
    priority: Issue["priority"];
    creatorId: number;
    description?: string;
    labels?: string[]; 
    assigneeId?: number;
}

export async function createIssue(data: CreateIssueData): Promise<Issue> {
    return await prisma.issue.create({
        data: {
            title: data.title,
            description: data.description,
            priority: data.priority,
            creatorId: data.creatorId,
            labels: data.labels,
            assigneeId: data.assigneeId ,
        },
    });
}

export async function getIssueByUserId(userId: number): Promise<Issue[]> {
    return await prisma.issue.findMany({
        where: {
            OR: [
                { creatorId: userId },
                { assigneeId: userId },
            ],
        },
    });
}

export async function getIssueById(issueId: number): Promise<Issue | null> {
    return await prisma.issue.findUnique({
        where: { id: issueId },
        include: { creator: true, comments: true }
    });
}