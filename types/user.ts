// export interface UserProfile {
//     uid: string;
//     type: 'parent' | 'child' | 'teacher';
//     name: string;
//     email?: string;
//     grade?: number;
//     avatarUrl?: string;
//     parentId?: string;
//     createdAt: number;
//     lastLogin?: number;
//     displayName?: string;
//     onboardingComplete?: boolean;
//     profileCompleted?: boolean;
//     isActive?: boolean;
//     settings?: {
//         language?: string;
//         darkMode?: boolean;
//         accessibility?: {
//             textToSpeech?: boolean;
//             colorContrast?: boolean;
//         };
//     };
//     provider?: 'google' | 'email' | 'apple' | 'facebook';
//     // Progress and rewards can also be subCollections if you scale big!
//     progress?: {
//         math?: { level: number; stars: number };
//         science?: { level: number; stars: number };
//         english?: { level: number; stars: number };
//     };
//     rewards?: string[];
// }
export interface UserProfile {
    uid: string;
    type: 'parent' | 'teacher';
    name: string;
    email: string;
    provider: 'email' | 'google' | 'apple' | 'facebook';
    avatarUrl?: string;
    createdAt: number;
    lastLogin?: number;
    onboardingComplete?: boolean;
    profileCompleted?: boolean;
    isActive?: boolean;
    settings?: {
        language?: string;
        darkMode?: boolean;
        accessibility?: {
            textToSpeech?: boolean;
            colorContrast?: boolean;
        };
    };
    childrenIds?: string[]; // for parents only
    classroomIds?: string[]; // for teachers only
}
