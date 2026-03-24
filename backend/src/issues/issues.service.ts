import { createIssue as createIssueRepo, getIssueById as getIssueByIdRepo, getIssueByUserId as getIssueByUserIdRepo } from "./issues.repository";
import { Comment, Issue, User } from "../generated/prisma";
import { CreateIssueData } from "./issues.repository";

export async function createIssue(data: CreateIssueData): Promise<Issue> {
    return await createIssueRepo(data);
}

export async function getIssueByUserId(id: number): Promise<(Issue & { creator: Pick<User, "id" | "name" | "email"> })[]> {
    return await getIssueByUserIdRepo(id);
}

export async function getIssueById(id: number): Promise<(Issue & { creator: Pick<User, "id" | "name" | "email">, comments: Comment[] }) | null> {
    return await getIssueByIdRepo(id);
}