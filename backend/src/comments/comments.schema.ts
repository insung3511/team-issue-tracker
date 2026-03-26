import z from "zod";

export const commentSchema = z.object({
    content: z.string().min(1, "Content is required"),
});
export const commentUpdateSchema = commentSchema.partial();

export type CommentInput = z.infer<typeof commentSchema>;
export type CommentUpdateInput = z.infer<typeof commentUpdateSchema>;