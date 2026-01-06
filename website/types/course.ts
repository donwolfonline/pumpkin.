
// website/types/course.ts

export type ValidationType =
    | 'OUTPUT_EXACT'    // Output must match string exactly
    | 'OUTPUT_CONTAINS' // Output must contain string
    | 'OUTPUT_REGEX'    // Output must match regex
    | 'CODE_CONTAINS'   // Source code must contain string
    | 'AST_NODE_COUNT'; // e.g., "Must have at least 2 loops"

export interface SuccessCondition {
    id: string; // "print_hello"
    type: ValidationType;
    value: string | number; // "Hello World" or 2
    message?: string; // Custom failure message "Don't forget to say Hello!"
}

export interface LockedRange {
    startLine: number;
    endLine: number;
}

export interface Lesson {
    id: string;          // "01_hello_world"
    title: string;       // "Chapter 1: The Pumpkin Patches"
    description: string; // Markdown: "In this lesson..."

    goal: string;        // "Print 'Hello Pumpkin' to the console."

    starterCode: string; // "show \"\""

    // Scaffolding: Lines that are read-only
    lockedRanges?: LockedRange[];

    // All conditions must be met for success
    successConditions: SuccessCondition[];
}

export interface Course {
    id: string;
    title: string;
    lessons: Lesson[];
}

export interface UserProgress {
    lastPlayedLessonId: string;
    completedLessons: string[]; // IDs
    unlockedLessons: string[]; // IDs
}
