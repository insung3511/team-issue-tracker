import { createIssue as createIssueRepo, getIssueById as getIssueByIdRepo, getIssueByUserId as getIssueByUserIdRepo } from "./issues.repository";
import { Issue } from "../generated/prisma";
import { CreateIssueData } from "./issues.repository";

export async function createIssue(data: CreateIssueData): Promise<Issue> {
    return await createIssueRepo({ 
        title: data.title,
        priority: data.priority,
        creatorId: data.creatorId,
        description: data.description,
        labels: data.labels,
        assigneeId: data.assigneeId
    });
}

export async function getIssueByUserId(id: number): Promise<Issue[]> {
    return await getIssueByUserIdRepo(id);
}

export async function getIssueById(id: number): Promise<Issue | null> {
    return await getIssueByIdRepo(id);
}