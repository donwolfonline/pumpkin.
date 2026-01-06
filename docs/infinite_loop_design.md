# Infinite Loop Detection UX

> **Status:** Authoritative
> **Goal:** Detect infinite loops and guide the user to a fix without frustration.
> **Principle:** "An infinite loop is just an enthusiastic program that didn't know when to stop."

## 1. Detection Logic (The "How")

We use a **Hybrid Detection Strategy** to differentiate between "long computations" and "true freezes".

### 1.1. The Gentle Guard (Instruction Limit)

* **Mechanism:** The Rust Interpreter counts every executed statement.
* **Threshold:** `1,000,000` instructions (approx. 200ms of CPU time).
* **Result:** If exceeded, the VM pauses execution and returns a specific `ResourceExhausted` error code.
* **Why:** This catches 99% of accidental `while(true)` loops immediately, before the browser even notices.

### 1.2. The Hard Stop (Watchdog Timer)

* **Mechanism:** The Main Thread (`PumpkinIDE.tsx`) starts a 5-second timer when `run()` is called.
* **Threshold:** 5 seconds.
* **Result:** If the worker hasn't responded, `worker.terminate()` is called.
* **Why:** Catches deep recursion stack overflows or logic bugs in the engine itself that might bypass the instruction counter.

---

## 2. User Experience (The "Feel")

When a loop is detected, the experience should be **educational**, not alarming.

### 2.1. Visual Feedback

* **State:** The IDE transitions to `ERROR`.
* **Highlight:** The line where the limit was hit (usually inside the loop body) is highlighted in yellow/orange (not red).
* **Icon:** Use a "Time" or "Infinity" icon (⏳ or ∞) instead of a "Crash" icon (💥).

### 2.2. Error Message Copy (The "Gentle" Part)

We avoid technical jargon like "Stack Overflow" or "Timeout".

**Scenario A: Instruction Limit Hit**

* **Title:** "Running a bit long?"
* **Message:** "Your code ran 1,000,000 instructions and was stopped to save power."
* **Hint:** "Do you have a loop that never stops? Check your `while` condition or `repeat` count."

**Scenario B: Watchdog Timeout**

* **Title:** "Execution Timed Out"
* **Message:** "The program stopped responding."
* **Hint:** "This usually happens with infinite loops. Did you forget to update your loop variable?"

---

## 3. Educational Hints

We can be smarter than just a generic message. By analyzing the AST around the error location, we can offer specific advice.

| Context | Detected Pattern | Specific Hint |
| :--- | :--- | :--- |
| **While Loop** | `while condition` (Condition is constant `true`) | "You are using `while true`. Did you forget to add a `break` statement?" |
| **While Loop** | Loop var not modified in body | "You are checking `x` in the loop condition, but `x` never changes inside the loop!" |
| **Repeat Loop** | Count > 10,000 | "That's a lot of repeats! Try a smaller number like 10 or 100 first." |

## 4. Implementation Details

1. **Rust Side:**
    * Return `PumpkinError::RuntimeError` with a specific subtype `RunawayLoop`.
    * Include the current `SourceLocation` (critical for highlighting).

2. **JS Side:**
    * Map `RunawayLoop` to the "Running a bit long?" UI card.
    * If `worker.terminate()` is used, synthesize a "System Error" that mimics the same UI but notes that the runtime was reset.

## 5. UI Mockup (Text)

```text
+-------------------------------------------------------+
|  [ ⏳ ]  Running a bit long?                          |
|                                                       |
|  Your program kept running for too long, so we        |
|  paused it.                                           |
|                                                       |
|  💡 Hint: It looks like your loop at line 4 never     |
|     stops. Check your condition!                      |
+-------------------------------------------------------+
```
