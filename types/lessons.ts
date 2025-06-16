// lessons/{lessonId}
export interface Lesson {
    id: string;                   // Unique identifier for the lesson
    title: string;                // Title of the lesson
    subject: 'math' | 'english' | 'science'; // Subject of the lesson
    grade: number;                // Grade level for the lesson
    content: string;              // Text or HTML content of the lesson
    media?: string[];             // Optional array of media URLs (images/audio/videos)
    questions?: {
        id: string;               // Unique identifier for the question
        question: string;         // The question text
        options: string[];        // Array of answer options
        answerIndex: number;      // Index of the correct answer in options array
    }[];                           // Optional array of questions for quizzes
    createdAt: number;
}