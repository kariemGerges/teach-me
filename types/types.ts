export type LessonStatus = 'completed' | 'in_progress' | 'locked';

export interface Lesson {
    id: string;
    title: string;
    status: LessonStatus;
    progress: number; // 0-100
    icon: string;
    allLessons: Lesson[];
    totalLessons: number;
}

export interface Module {
    id: string;
    title: string;
    icon: string;
    lessons: Lesson[];
    completedLessons: number;
    totalLessons: number;
}

export interface LearningProgressProps {
    // Props can be added here if needed
}

export interface SubjectSelectionProps {
    onSubjectGradeSelect?: (subject: string, grade: string) => void;
}

export type Subject = 'math' | 'science' | 'english';
export type Grade =
    | 'kindergarten'
    | 'grade_1'
    | 'grade_2'
    | 'grade_3'
    | 'grade_4'
    | 'grade_5';

export interface Question {
    id: number;
    question: string;
    options: string[];
    correct: number;
    hint: string;
}

export interface Example {
    problem?: string;
    solution?: string;
    explanation?: string;
    fraction1?: string;
    fraction2?: string;
    number?: string;
    breakdown?: string;
    scenario?: string;
    probability?: string;
}

export interface Activity {
    type: string;
    question?: string;
    pairs?: { fraction: string; equivalent: string }[];
    problems?: { fraction: string; equivalent: string; answer: string }[];
    challenges?: { clue: string; answer: string }[];
    datasets?: any[];
    experiments?: string[];
    key_points?: string[];
    sample_summary?: string;
}

export interface LessonContent {
    introduction: string;
    instructions: string;
    examples?: Example[];
    questions?: Question[];
    activities?: Activity[];
    reward: string;
    passage?: string;
    key_concepts?: string[];
    virtual_experiments?: any[];
    story_elements?: any;
    story_starters?: string[];
    writing_techniques?: any;
    revision_checklist?: string[];
    [key: string]: any; // For additional flexible properties
}

export interface Lesson2 {
    title: string;
    type:
        | 'quiz'
        | 'interactive'
        | 'writing'
        | 'experiment'
        | 'design_project'
        | 'labeling'
        | 'map_activity';
    content: LessonContent;
}

export interface LessonScreenProps {
    route: {
        params: {
            lesson: Lesson;
            subjectName: string;
            topicName: string;
        };
    };
    navigation: any;
}

// types/lesson.ts
export interface BaseLesson {
    id: string;
    title: string;
    subject: string;
    module: string;
    type: string;
    content: any; // This will hold the dynamic content
}

export interface MathLesson extends BaseLesson {
    type: 'math';
    content: {
        feedback?: {
            correct: string;
            incorrect: string;
            hint: string;
        };
        instructions?: string[];
        interactiveElements?: {
            answer: string;
            counting: string;
            grouping: string;
        }[];
        items?: [];
        question?: string;
        visualStory: {
            characters: string;
            scenario: string;
            setting: string;
        };
        enhanced: true;
        id: string;
        in_progress: boolean;
        lastUpdated: number;
        locked: boolean;
    };
}

export interface ScienceLesson extends BaseLesson {
    type: 'science';
    content: {
        theory?: string;
        diagrams?: string[];
        experiments?: {
            title: string;
            materials: string[];
            procedure: string[];
            observation: string;
        }[];
        facts?: string[];
    };
}

export interface EnglishLesson extends BaseLesson {
    type: 'english';
    content: {
        passage?: string;
        vocabulary?: { word: string; meaning: string }[];
        grammar?: {
            rule: string;
            examples: string[];
        };
        exercises?: {
            question: string;
            options?: string[];
            answer: string;
        }[];
    };
}

export type Lesson3 = MathLesson | ScienceLesson | EnglishLesson;
