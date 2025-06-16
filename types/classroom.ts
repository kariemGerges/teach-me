export interface Classroom {
    classId: string; // Firestore doc ID
    name: string;
    subject?: string;
    grade: number;
    teacherId: string;
    studentIds: string[]; // UIDs from /children
    joinCode: string; // Optional code for self-enroll
    createdAt: number;
}
