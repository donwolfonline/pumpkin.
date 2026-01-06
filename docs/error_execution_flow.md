# Error Execution Flow (Educational)

> **Status:** Authoritative
> **Goal:** Transform execution failures into learning moments.
> **Principle:** "Errors teach, they don’t punish."

## 1. Overview

In Pumpkin, an error is not just a crash—it's a specialized UI state designed to guide the learner. We categorize errors into three distinct buckets, each with a tailored user experience.

---

## 2. Error Categories & UX

### 2.1. Syntax Errors (The "What?")

* **Origin:** `ohm-js` parser (Frontend).
* **Trigger:** Invalid grammar (e.g., missing closing brace, typo in keyword).
* **UX Behavior:**
    1. **Stop:** Execution never starts.
    2. **Highlight:** Red squiggly line under the specific token in CodeMirror.
    3. **Message:** "You might have a typo here."
    4. **Action:** Quick fix suggestion if available (e.g., "Did you mean `show`?").

### 2.2. Runtime Errors (The "How?")

* **Origin:** `pumpkin_core` Rust VM.
* **Trigger:** Invalid logic (e.g., `1 / 0`, `show x` where `x` is undefined).
* **UX Behavior:**
    1. **Halt:** Execution stops immediately.
    2. **Console:** Displays a formatted error card.
    3. **Editor:** Highlights the line that caused the crash.
    4. **Hint:** Displays the contextual hint provided by the VM.

### 2.3. System Errors (The "WTF?")

* **Origin:** Web Worker / Browser / Rust Panic.
* **Trigger:** Infinite loop timeout, Out of Memory, VM Bug.
* **UX Behavior:**
    1. **Kill:** The worker is terminated.
    2. **Alert:** A specialized "The Pumpkin Smashed" modal or banner.
    3. **Action:** "Restart Runtime" button.

---

## 3. Unified Error Schema

All errors, regardless of origin, must map to this JSON structure before reaching the React UI.

```typescript
interface PumpkinErrorObject {
    // High-level category for UI styling
    category: 'Syntax' | 'Runtime' | 'System';

    // The friendly, human-readable message
    message: string;

    // Line number (1-based)
    line?: number;

    // Column number (if available)
    column?: number;
    
    // Optional educational hint
    hint?: string;

    // Technical details (for advanced debugging/report)
    technical?: string; 
}
```

## 4. Mapping Guide

### 4.1. Mapping Ohm Syntax Errors

Ohm errors are verbose. We must truncate them.

* **Raw Ohm:** `Expected "}" but found end of input at line 5 col 1.`
* **Pumpkin UI:**
  * `category`: `Syntax`
  * `message`: `Unexpected end of file.`
  * `hint`: `Did you forget a closing brace '}'?`
  * `line`: 5

### 4.2. Mapping Rust Runtime Errors

These map directly from the `PumpkinError` struct in `pumpkin_core`.

* **Rust Struct:**

    ```rust
    UndefinedVariableError { name: "y", location: { line: 3 }, hint: "Did you declare it?" }
    ```

* **Pumpkin UI:**
  * `category`: `Runtime`
  * `message`: `Variable 'y' is not defined.`
  * `hint`: `Did you declare it?`
  * `line`: 3

### 4.3. Mapping Timeouts

* **Raw:** `Worker.onTimeout`
* **Pumpkin UI:**
  * `category`: `System`
  * `message`: `Execution timed out.`
  * `hint`: `Do you have an infinite loop? (e.g. 'loop' without a 'break' or condition)`
  * `line`: undefined (or last known executed line if tracking enabled)

---

## 5. UI Component Rules

### The Console Error Card

Do not just print red text. Render a structured component:

```tsx
<div className="bg-red-50 border-l-4 border-red-500 p-4">
  <div className="flex items-center">
    <div className="flex-shrink-0">
      <AlertIcon />
    </div>
    <div className="ml-3">
      <p className="text-sm font-bold text-red-800">
        {error.category} Error on Line {error.line}
      </p>
      <p className="text-sm text-red-700 mt-1">
        {error.message}
      </p>
      {error.hint && (
        <p className="text-xs text-red-600 mt-2 italic">
          💡 Tip: {error.hint}
        </p>
      )}
    </div>
  </div>
</div>
```

### The Editor Gutter

* Add a **red dot** in the gutter at the error line.
* Hovering the dot shows the error message tooltip.
