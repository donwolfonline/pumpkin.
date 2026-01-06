# Pumpkin Error System Design (v1.0)

> **Philosophy:** Errors are not failures; they are helpful teachers.
> **Audience:** First-time coders. Avoid "stack trace", "segmentation fault", "null pointer".

## 1. UX Guiding Principles

1. **Friendly Tone:** Use natural language. "The computer is confused" rather than "Fatal Error".
2. **Actionable Hints:** Every error MUST have a standard "Try this" or "Did you mean?" section.
3. **Visual Context:** Always point to the exact character/line in the source code.
4. **No Jargon:**
    * Bad: "Unexpected token ')' at EOF"
    * Good: "It looks like you forgot to close a parenthesis here."

## 2. Error Taxonomy

The backend (`pumpkin_core`) will categorize errors into these high-level variants:

### 2.1. `SyntaxError` (I didn't understand that)

* **Source:** Parser/Grammar (Ohm).
* **Examples:** Missing brace, unclosed string, invalid keyword usage.
* **Format:** "I expected a ')' here, but found '}'."

### 2.2. `ReferenceError` (I can't find that)

* **Source:** `UndefinedVariableError`.
* **Examples:** Using a variable before `let`, misspelling a name.
* **Logic:** Fuzzy match against existing variables for "Did you mean 'count'?"

### 2.3. `TypeError` (This doesn't fit)

* **Source:** Binary ops, function calls.
* **Examples:** Adding number to boolean, calling a number `5()`, array index with string.
* **Format:** "I need a Number here, but 'name' is a Text (String)."

### 2.4. `LogicError` (I can't do that)

* **Source:** `DivisionByZero`, `IndexOutOfBounds`.
* **Examples:** `10 / 0`, `list[99]` when length is 3.

### 2.5. `SystemError` (I'm tired)

* **Source:** `ResourceExhausted`.
* **Examples:** Infinite loop protection, stack overflow (recursion limit).

## 3. Data Structure (Rust -> Frontend)

The `PumpkinError` struct will be updated to ensure rich metadata transfer to the UI.

```rust
pub struct PumpkinError {
    pub kind: ErrorKind,      // Syntax, Reference, Type, etc.
    pub message: String,      // The main "what happened"
    pub location: Option<SourceLocation>, // { line, col, length }
    pub hint: Option<String>, // "Did you mean...?" or "Don't divide by zero"
    pub code: String,          // e.g., "E001" for documentation lookup
}
```

## 4. Example Messages

| Script | Old Message | New Message | Hint |
| :--- | :--- | :--- | :--- |
| `show x` (x not defined) | Undefined Variable: 'x' | I can't find a variable named 'x'. | "Did you mean 'y'? Or did you forget to use 'let'?" |
| `10 / 0` | Division by Zero | I can't divide 10 by 0. | "Division by zero creates infinity, which I can't handle!" |
| `let a = [1]; a[5]` | Index out of bounds | That item is missing. | "This list has 1 item, so you can only use index 0." |

## 5. Implementation Plan

1. **Update `errors.rs`:** refactor `PumpkinError` to use the new fields.
2. **Parser Integration:** Ensure Ohm errors (from worker) map to this JSON structure before reaching the UI.
3. **UI:** Build an `ErrorDisplay` component that renders the `location` as a highlighted code snippet.
