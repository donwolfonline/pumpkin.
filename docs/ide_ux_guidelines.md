# IDE UX Guidelines: The Beginner Standard 🧸

**Goal:** Zero confusion.
**Audience:** Absolute beginners (First time writing code).

## 1. Core Principles

### A. "What Just Happened?"

Every action must have an immediate, visible reaction.

* **Run Clicked:** Spinner appears immediately.
* **Run Finished:** "Done" indicator appears (even if no output).
* **No Output:** If the program runs but prints nothing, show a ghost text: *(Program ran successfully but produced no output. Try adding `show "Hello"`)*.

### B. Friendly Empty States

A blank screen is terrifying.

* **Initial State:** Never empty. Always load with the "Hello World" template.
* **Console:** If empty, show: "Ready to run. Click the Green Button ▶".

### C. No Technobabble

* **Bad:** `Process exited with code 0`.
* **Good:** `✨ Done`.
* **Bad:** `Uncaught ReferenceError`.
* **Good:** `❌ I don't know what that name means`.

## 2. Error Display Rules

Errors are "Teachable Moments", not punishments.

### Visual Hierarchy

1. **Summary:** One friendly line. `Ops, I found a typo.`
2. **Location:** `Line 3`. (Clickable if possible).
3. **Detail:** The specific complaint. `Variable 'count' is not defined.`
4. **Hint:** The fix. `Did you mean to create it with 'let count = ...'?`

### Examples

| Scenario | Professional (Bad) | Pumpkin (Good) |
| :--- | :--- | :--- |
| **Missing Let** | `ReferenceError: x is not defined` | `❌ Unknown Name: 'x'. I don't see a variable with this name. Did you forget 'let'?` |
| **Division by Zero** | `ArithmeticException` | `❌ Math Error: You tried to divide by zero on Line 5. That's impossible!` |
| **Syntax Error** | `Unexpected token '{'` | `❌ Syntax Error: I wasn't expecting a '{' here. Maybe check the line before?` |

## 3. Microcopy Standards

* **Run Button:** `Run` (Icon: ▶). Tooltip: "Execute your code".
* **Reset Button:** `Reset` (Icon: ↺). Warning: "This will delete your changes. Are you sure?".
* **Status Bar:**
  * *Idle:* "Ready"
  * *Running:* "Running..."
  * *Success:* "Finished in 0.2s"
  * *Error:* "Failed"

## 4. Interaction Rules

* **Console Visibility:** The console must **never** be hidden when running code. On mobile, if the console is below the fold, auto-scroll to it when "Run" is clicked.
* **Editor Focus:** After "Reset", focus the editor so the user can type immediately.
* **Selection:** Double-clicking a variable in the editor should highlight other usages (CodeMirror default, but ensure it's on).

## 5. Success Metric (The "Grandma Test")

If a non-coder runs the code, makes a typo, and can fix it *just by reading the error message*, we have succeeded.
