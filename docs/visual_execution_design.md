# Visual Execution Layer Design

> **Status:** Authoritative
> **Goal:** Visualize the flow of logic without abstracting away the code.
> **Principle:** "Code is the truth; visuals are the map."

## 1. Visual Metaphor: The "Reading Finger"

When a human reads code, they trace lines with their finger. The IDE should mimic this.

* **The Cursor:** A warm, orange indicator (The "Pumpkin Pointer") in the left gutter tracking the active line.
* **The Flow:** Subtle, animated lines connecting the previous statement to the current one (phantom arrows).

## 2. UI Layout Components

### 2.1. The Active Line Gutter

* **Location:** Left side of the Monaco editor (Line number area).
* **Visual:**
  * **Icon:** `▶` (Play arrow) or `🎃` (Pumpkin icon) at the current execution line.
  * **Highlight:** The entire active line text has a soft amber background (`bg-amber-100`).

### 2.2. Inline Value Bubbles (The "Ghost Text")

* **Location:** Right side of the code, or directly overlaying the end of the line.
* **Trigger:** When a `let` statement or assignment executes.
* **Visual:**
  * A floating "bubble" appears: `x: 3`.
  * **Animation:** Fades in, floats up slightly, then docks into a "Variable Watch" sidebar (if open) or fades out.
  * **Style:** Semi-transparent distinct color (e.g., Purple for `let`, Blue for mutation).

### 2.3. The Flow Arrows

* **Trigger:** Moving from line A to line B.
* **Visual:**
  * If Line B is the immediate next line: No arrow (implied flow).
  * If Line B is a jump (e.g., `if` branch, `repeat` loop back):
    * Draw a curved SVG line overlay on top of the editor canvas connecting Line A end to Line B start.
    * **Style:** Dotted line, Pumpkin Orange opacity 50%.

## 3. Execution Control Bar (The "VCR")

A floating control bar focused on the "Player" metaphor.

```text
[ Reset ]  [ << Prev ]  [ Play/Pause ]  [ Next >> ]  [ Speed: 1x ]
```

* **Next (Step Over):** Executes one AST node.
* **Play:** Runs continuously.
* **Speed:** Controls the delay between steps (Slow/Normal/Fast/Instant).

## 4. Example Scenario

**Code:**

```pumpkin
1: show "Hello"
2: let x = 3
3: show x
```

**Step 1 (Start):**

* **Gutter:** Pointer at Line 1.
* **Action:** User clicks "Next".
* **Visual:** Console prints "Hello".

**Step 2:**

* **Gutter:** Pointer moves to Line 2.
* **Action:** User clicks "Next".
* **Visual:**
  * Bubble appears at end of Line 2: `x = 3`.
  * Variable Panel updates: `x: 3`.

**Step 3:**

* **Gutter:** Pointer moves to Line 3.
* **Action:** User clicks "Next".
* **Visual:**
  * Console prints `3`.
  * Execution Complete.

## 5. Technical Implementation (Monaco)

### 5.1. Line Decorations

Use `editor.deltaDecorations` to render the line background and gutter icon.

```typescript
// Monaco Decoration
{
    range: new monaco.Range(line, 1, line, 1),
    options: {
        isWholeLine: true,
        className: 'execution-line-highlight', // CSS for background
        glyphMarginClassName: 'execution-gutter-icon' // CSS for arrow
    }
}
```

### 5.2. Overlay Widgets

Use `editor.addContentWidget` for the Inline Value Bubbles. This allows placing arbitrary React components anchored to specific line/column coordinates in the text.

## 6. Execution State Model Integration

This visual layer purely *reflects* the state defined in `docs/execution_state_model.md`:

* `PAUSED` state -> Renders Gutter Icon & Highlight.
* `DEBUGGING` state -> Enables the Value Bubbles.
* `RUNNING` state (Fast) -> Hides visual overlays to save performance (except console).
