import z from "zod";

export const createTeamSchema = z.object({
    name: z.string().min(1, "Team name is required"),
    members: z.array(z.number()).optional(), // Array of user IDs
});

export const updateTeamSchema = z.object({
    name: z.string().min(1, "Team name is required").optional(),
    members: z.array(z.number()).optional(), // Array of user IDs
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;