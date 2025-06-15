import { z } from 'zod';

export const userProfileSchema = z.object({
    uid: z.string(),
    type: z.enum(['parent', 'child', 'teacher']),
    name: z.string(),
    email: z.string().email().optional(),
    grade: z.number().optional(),
    avatarUrl: z.string().url().optional(),
    parentId: z.string().optional(),
    createdAt: z.number(),
    lastLogin: z.number().optional(),
    displayName: z.string().optional(),
    onboardingComplete: z.boolean().optional(),
    profileCompleted: z.boolean().optional(),
    isActive: z.boolean().optional(),
    settings: z
        .object({
            language: z.string().optional(),
            darkMode: z.boolean().optional(),
            accessibility: z
                .object({
                    textToSpeech: z.boolean().optional(),
                    colorContrast: z.boolean().optional(),
                })
                .optional(),
        })
        .optional(),
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
    provider: z.enum(['google', 'email', 'apple', 'facebook']).optional(),
    rewards: z.array(z.string()).optional(),
});
