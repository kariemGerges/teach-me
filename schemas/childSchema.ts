import { z } from "zod";

export const childSchema = z.object({
    uid: z.string(),
    type: z.literal('child'),
    name: z.string(),
    grade: z.number(),
    pin: z.string().min(4).max(6),
    parentId: z.string().optional(),
    classIds: z.array(z.string()).optional(),
    avatarUrl: z.string().url().optional(),
    createdAt: z.number(),
    lastLogin: z.number().optional(),

    progress: z
        .object({
            math: z.object({ level: z.number(), stars: z.number() }).optional(),
            science: z
                .object({ level: z.number(), stars: z.number() })
                .optional(),
            english: z
                .object({ level: z.number(), stars: z.number() })
                .optional(),
        })
        .optional(),

    rewards: z.array(z.string()).optional(),
});


export type Child = z.infer<typeof childSchema>;