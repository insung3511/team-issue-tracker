import z from "zod";

export const issueSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    labels: z.array(z.string()).optional(),
    assigneeId: z.number().optional(),
})
export const issueUpdateSchema = issueSchema.partial();
export const issueStatusUpdateSchema = z.object({
    status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"])
});
export const issueListQuerySchema = z.object({
    status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(10),
});

export type IssueInput = z.infer<typeof issueSchema>;
export type IssueUpdateInput = z.infer<typeof issueUpdateSchema>;
export type IssueStatusUpdateInput = z.infer<typeof issueStatusUpdateSchema>;
export type IssueListQueryInput = z.infer<typeof issueListQuerySchema>;