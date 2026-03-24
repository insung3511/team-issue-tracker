import { createIssue as createIssueRepo } from "./issues.repository";
import { Issue } from "../generated/prisma";

export async function createIssue(
    title: string,
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    creatorId: number,
    description?: string,
    labels?: string[],
    assigneeId?: number
): Promise<Issue> {
    return await createIssueRepo(title, priority, creatorId, labels, description, assigneeId);
}

