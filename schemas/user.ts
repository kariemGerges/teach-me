import { z } from 'zod';

export const userProfileSchema = z.object({
    uid: z.string(),
    type: z.enum(['parent', 'teacher']),
    name: z.string(),
    email: z.string().email(),
    provider: z.enum(['google', 'email', 'apple', 'facebook']),
    avatarUrl: z.string().url().optional(),
    createdAt: z.number(),
    lastLogin: z.number().optional(),
    onboardingComplete: z.boolean().optional(),
    profileCompleted: z.boolean().optional(),
    isActive: z.boolean().optional(),
    displayName: z.string().optional(),

    // Parent-specific
    childrenIds: z.array(z.string()).optional(),

    // Teacher-specific
    classroomIds: z.array(z.string()).optional(),

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
});

export type UserProfile = z.infer<typeof userProfileSchema>;
