import { z } from 'zod';


export const classroomSchema = z.object({
    classId: z.string(), // Firestore doc ID
    name: z.string(),
    subject: z.string().optional(),
    grade: z.number(),
    teacherId: z.string(),
    studentIds: z.array(z.string()), // child UIDs
    joinCode: z.string(), // short, unique string
    createdAt: z.number(),
});


export type Classroom = z.infer<typeof classroomSchema>;