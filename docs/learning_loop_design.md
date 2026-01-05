# IDE → Docs Learning Loop 📚🔄

**Goal:** Transform the IDE from a "Tool" into a "Teacher".
**Philosophy:** Contextual help beats heavy tutorials. "Teach without lecturing."

## 1. UX Flow

### A. The "Error Pivot"

When a user hits a runtime error, they are often stuck.

* **Trigger:** Error appears in Console (e.g., `DivisionByZero`).
* **UI:** Next to the error message, a small, subtle link appears: `📖 Explain this`.
* **Action:** Clicking opens a slide-over panel (or new tab) directly to `docs/errors/division-by-zero`.
* **Result:** User reads *why* it happened, not just *that* it happened.

### B. The "Example Swap"

Users learn by remixing.

* **UI:** A "Library" dropdown in the IDE header.
* **Content:**
    1. *Hello World* (Basics)
    2. *Coin Flip* (Conditionals)
    3. *Counter* (Loops)
    4. *FizzBuzz* (Logic)
* **Action:** Selecting an example replaces the current code.
* **Safety:** "You have unsaved changes. Overwrite?" execution.

## 2. Linking Strategy 🔗

We need a stable way to link Errors to Docs.

### Error Codes

Every `PumpkinError` must carry a stable `code`.

* `E001`: Syntax Error
* `E002`: Undefined Variable
* `E003`: Type Mismatch
* `E004`: Division By Zero

### URL Schema

`https://pumpkin-lang.org/docs/errors/[CODE]`

### Mockup

```
❌ Math Error: Division by Zero
   (Line 10)
   
   [ 📖 Why is this happening? ]  <-- Link to /docs/errors/E004
```

## 3. Inline Hints (The "Whisper")

Instead of shouting errors, we gently suggest fixes using the editor's UI.

* **Scenario:** User types `print "hi"`. (Pumpkin uses `show`).
* **Detection:** Regex/Parser checks for common keywords from other languages.
* **UI:** Yellow squiggle or "Lightbulb" icon.
* **Hint Text:** "In Pumpkin, we use `show` to print text."
* **Action:** Clicking "Fix" auto-replaces `print` with `show`.

## 4. Example Mappings

These examples map concepts to code snippets.

| Concept | Example Name | Key Features |
| :--- | :--- | :--- |
| **Output** | `hello.pumpkin` | `show` |
| **Variables** | `variables.pumpkin` | `let`, `+` strings |
| **Math** | `math.pumpkin` | `+`, `-`, `*`, `/` |
| **Logic** | `conditions.pumpkin` | `if`, `else`, `>` |
| **Loops** | `loops.pumpkin` | `repeat`, `while` |

## 5. Implementation Plan

1. **Docs:** Create `/docs/errors/[code]` pages.
2. **IDE:** Update `Console.tsx` to render "Explain this" links if `error.code` is present.
3. **IDE:** Add `ExampleSelector` component to `PumpkinIDE.tsx`.
