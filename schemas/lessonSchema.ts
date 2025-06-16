import { z } from 'zod';

export const lessonSchema = z.object({
    lessonId: z.string(), // Firestore doc ID
    title: z.string(),
    subject: z.enum(['math', 'english', 'science']),
    grade: z.number(),
    content: z.string(),
    media: z.array(z.string()).optional(), // image/video/audio URLs

    questions: z
        .array(
            z.object({
                id: z.string(),
                question: z.string(),
                options: z.array(z.string()),
                answerIndex: z.number(), // 0-based index
            })
        )
        .optional(),

    createdAt: z.number(),
});

export type Lesson = z.infer<typeof lessonSchema>;