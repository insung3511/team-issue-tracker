import prisma from "../lib/prisma";
import { Comment, Issue, User } from "../generated/prisma";

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