# Learn Page UX Design

> **Objective:** Convert visitors into coders with zero friction.
> **URL:** `/learn`

## 1. User Journey

### Phase 1: The "Cold Start" (No history)

* **Hero Section:** "Start Coding in 30 Seconds"
* **Primary Action:** A massive, pulsing "Start Lesson 1" button.
* **Value Prop:** "No Setup. No Install. Just Pumpkin."
* **Visual:** A sneak peek of the IDE (static image or animation).

### Phase 2: Active Learning (Inside the IDE)

The UI transforms into **Course Mode** (as defined in `course_mode_design.md`).

* **Left Sidebar (30%):**
  * **Progress Bar:** "Lesson 1 of 5"
  * **Title & Story:** "Hello, Pumpkin!"
  * **The Mission:** "Make the computer say hello."
  * **Hint System:** Collapsible "Need a hint?" section.
* **Right Area (70%):**
  * **Editor:** Pre-filled with `show "Hello World"`.
  * **Run Button:** Prominent Green Play Button.

### Phase 3: The "Aha!" Moment (Validation)

The user clicks run.

* **Scenario A: Success**
  * Confetti animation (optional but nice).
  * **Overlay Card:** "You did it! 🎃"
  * **Action:** "Next Lesson ->" (Auto-focus).
* **Scenario B: Failure**
  * **Console:** Shows output.
  * **Helper:** "Almost! You printed 'Hello World', but we need 'Hello Pumpkin'."

### Phase 4: Returning Student (Has local storage)

* **Hero:** "Welcome back, Coder!"
* **Primary Action:** "Continue Lesson 3: Math".
* **Map:** A cute visual map of the "Pumpkin Patch" showing completed levels as orange pumpkins and locked levels as gray seeds.

## 2. Technical Components

### `LessonLayout.tsx`

Wraps the IDE and Instructions.

```tsx
<div className="flex h-screen">
  <InstructionPanel lesson={currentLesson} />
  <div className="flex-1">
    <PumpkinIDE mode="COURSE" lesson={currentLesson} onSuccess={...} />
  </div>
</div>
```

### `CourseProgress` Hook

Manages `localStorage` reads/writes to determine which lesson is active.

## 3. The "Course Mode" Prop

We need to update `PumpkinIDE.tsx` to handle:

* `props.mode = 'COURSE'`
* `props.lesson`: The current Lesson object.
* **Locking:** Passing `readOnly` ranges to Monaco.
* **Validation:** Running the `validateLesson` logic after execution.
