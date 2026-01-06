# Course Mode Design: Architecture & Schema

> **Status:** Authoritative
> **Goal:** A robust, offline-first learning engine.

## 1. Lesson Schema (JSON Model)

Each lesson is a self-contained unit defined in TypeScript/JSON.

```typescript
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

export interface Lesson {
    id: string;          // "01_hello_world"
    title: string;       // "Chapter 1: The Pumpkin Patches"
    description: string; // Markdown: "In this lesson..."
    
    goal: string;        // "Print 'Hello Pumpkin' to the console."
    
    starterCode: string; // "show \"\""
    
    // Scaffolding: Lines that are read-only
    lockedRanges?: { startLine: number, endLine: number }[];
    
    // All conditions must be met for success
    successConditions: SuccessCondition[];
}

export interface Course {
    id: string;
    title: string;
    lessons: Lesson[];
}
```

## 2. Validation Engine Design

The validator runs **synchronously** after the execution finishes. It inspects two artifacts:

1. **Execution Result:** The `output` array from the Runner.
2. **Source Code:** The text in the editor.

### 2.1. Validation Logic

The `validateLesson(lesson, executionResult, sourceCode)` function iterates through `successConditions`.

| Type | Check Logic |
| :--- | :--- |
| `OUTPUT_EXACT` | `result.output.join('\n').trim() === condition.value` |
| `OUTPUT_CONTAINS` | `result.output.some(line => line.includes(condition.value))` |
| `OUTPUT_REGEX` | `new RegExp(condition.value).test(result.output.join('\n'))` |
| `CODE_CONTAINS` | `sourceCode.includes(condition.value)` |

### 2.2. Feedback Loop

* **Partial Success:** If there are 3 disparate conditions, we can show a checklist.
  * [x] Create a variable
  * [ ] Print the variable
* **Completion:** When all pass -> Fire fireworks -> Update Progression.

## 3. Course Progression Model (Offline-First)

Progress is stored in `localStorage` to ensure privacy and offline capability.

### 3.1. Storage Schema

```json
// Key: "pumpkin_course_v1"
{
  "lastPlayedLessonId": "03_loops",
  "completedLessons": ["01_basics", "02_variables"],
  "unlockedLessons": ["01_basics", "02_variables", "03_loops"]
}
```

### 3.2. State Machine Transitions

* **Init:** Load state from LS. If empty, unlock Lesson 1.
* **Lesson_Success:**
    1. Add current ID to `completedLessons`.
    2. Unlock next lesson in `Course` list.
    3. Save to LS.
    4. UI: "Next Lesson" button becomes active.

## 4. Example Lesson JSON

```json
{
  "id": "intro_math",
  "title": "Pumpkin Math",
  "description": "Pumpkins are great at counting. Let's add some numbers.",
  "goal": "Calculate 5 + 5 and show the result.",
  "starterCode": "show 5 + ",
  "lockedRanges": [],
  "successConditions": [
    {
      "type": "OUTPUT_EXACT",
      "value": "10",
      "message": "The output should be exactly 10."
    },
    {
      "type": "CODE_CONTAINS",
      "value": "+",
      "message": "Make sure to use the plus sign!"
    }
  ]
}
```
