export type LessonStatus = 'completed' | 'in_progress' | 'locked';

export interface Lesson {
    id: string;
    title: string;
    status: LessonStatus;
    progress: number; // 0-100
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
    pairs?: Array<{ fraction: string; equivalent: string }>;
    problems?: Array<{ fraction: string; equivalent: string; answer: string }>;
    challenges?: Array<{ clue: string; answer: string }>;
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