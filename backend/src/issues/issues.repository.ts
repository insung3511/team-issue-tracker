import prisma from "../lib/prisma";

export async function createIssue(
    title: string,
    priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT",
    creatorId: number,
    labels?: string[],
    description?: string,
    assigneeId?: number
) {
    return await prisma.issue.create({
        data: {
            title,
            description,
            priority,
            creatorId,
            labels,
            assigneeId,
        },
    });
}

