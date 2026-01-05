# 🎡 Pumpkin Playground UX Design

## Design Goals

* **Zero Barrier**: No setup, just code.
* **Confidence**: Friendly UI that celebrates success and gently handling errors.
* **Aesthetic**: Dark "Night Sky" theme with "Pumpkin Orange" actions.

---

## 1. Layout Structure

```text
+-----------------------------------------------------------+
|  🎃 Pumpkin Playground                      [Docs] [Home] |
+-----------------------------+-----------------------------+
|  1  show "Hello"            |  Output                     |
|  2                          |                             |
|  3                          |  Hello                      |
|  4                          |                             |
|  5                          |                             |
|  6                          |                             |
|  7                          |                             |
|                             |                             |
|          [Editor]           |          [Console]          |
+-----------------------------+-----------------------------+
|  [🚀 Run]  [🗑️ Clear]      [📂 Examples v]    [🔗 Share]  |
+-----------------------------------------------------------+
```

---

## 2. Component List

### Header

* **Logo**: Clicking returns to Homepage.
* **Nav**: Minimal links (Docs, Home).

### Code Editor (Left Panel)

* **Theme**: Dark mode (High contrast).
* **Font**: Fira Code / JetBrains Mono.
* **Features**:
  * Line numbers (muted grey).
  * Syntax Highlighting:
    * Keywords (`show`, `let`, `if`): Orange `#FF7518`.
    * Strings: Green `#3B8132`.
    * Numbers: Blue/Purple.
  * Auto-closing quotes/brackets.

### Output Panel (Right Panel)

* **Default State**: "Hit Run to see magic happen! ✨" (Grey text).
* **Success State**: White text on dark background.
* **Error State**:
  * **Header**: "🎃 Whoops!" (Orange).
  * **Body**: "What happened...", "Why...", "How to fix...".
  * **No stack traces**.

### Control Bar (Bottom/Sticky)

* **Run Button**:
  * Primary Action.
  * Color: Pumpkin Orange (`#FF7518`).
  * Icon: 🚀.
  * Animation: subtle "press" effect.
* **Clear Button**:
  * Secondary Action.
  * Clears Output (not code).
* **Examples Dropdown**:
  * Quick load: "Hello World", "Calculator", "Game".
* **Share Button**:
  * Generates a URL with encoded code.

---

## 3. Interaction States

### A. Initial Load

* **Editor**: Pre-filled with "Hello World" comments.
* **Output**: "Ready to run...".

### B. Running Code

* **Action**: User clicks "Run".
* **Visual**: "Run" button shows spinner/loading state (briefly).
* **Result**: Output appears instantly in the right panel.

### C. Example Selection

* **Action**: User selects "Guess Number Game".
* **Warning Modal**: "This will overwrite your current code. Continue?"
* **Result**: Editor content replaced.

### D. Input Handling (`ask`)

* **Scenario**: Code contains `ask "Name?" into n`.
* **UI Change**: A modal or inline input box appears in the Output Panel.
* **Focus**: Cursor automatically jumps to the input box.

---

## 4. Mobile Experience

* **Layout**: Stacked. Editor on Top, Output on Bottom.
* **Controls**: Fixed bar at the bottom of the screen.
* **Keyboard**: specialized toolbar for common symbols (`"`, `+`, `=`, `{`, `}`).

---

## 5. Technical Requirements (For React)

* **State Management**: Store code string and output array.
* **Runner**: WebWorker to run the interpreter safely off the main thread.
* **Persistance**: `localStorage` to save code between reloads.
