import z from "zod";

export const issueSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    labels: z.array(z.string()).optional(),
    assigneeId: z.number().optional(),
})

export type IssueInput = z.infer<typeof issueSchema>;