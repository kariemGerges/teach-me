export interface Children {
    // children/{childId}
    uid: string; // Firestore doc ID
    type: 'child';
    name: string;
    grade: number;
    pin: string; // hashed or securely stored
    avatarUrl?: string;
    parentId?: string; // if added by parent
    classIds?: string[]; // if enrolled in classrooms
    createdAt: number;
    lastLogin?: number;
    progress?: {
        math?: { level: number; stars: number };
        science?: { level: number; stars: number };
        english?: { level: number; stars: number };
    };
    isActive?: boolean; // if the child is active
    rewards?: string[];
}
