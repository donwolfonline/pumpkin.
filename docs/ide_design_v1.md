# Pumpkin IDE Design v1 🎡

**Goal:** A joyful, zero-friction coding playground.
**Platform:** Web (Browser + WASM)

## 1. Design Philosophy

* **Toy-Like:** It should feel like a game console, not a cockpit. limit knobs and dials.
* **Inviting:** Use friendly colors, rounded corners, and clear "Play" buttons.
* **Resilient:** If the user breaks it, a big "Reset" button fixes it instantly.

## 2. Layout Structure

### Desktop (Standard)

```
+---------------------------------------------------------------+
|  Header: [🎃 Pumpkin]  [ ▶ Run ]  [ ↺ Reset ]                 |
+---------------------------------------------------------------+
|                               |                               |
|        Code Editor            |       Output Console          |
|      (Line Numbers)           |    (Log lines + Errors)       |
|                               |                               |
|   let x = 10                  |   > 10                        |
|   show x                      |   >                           |
|                               |                               |
+---------------------------------------------------------------+
|  Footer: Status (Ready)       |  Version: v0.1.0              |
+---------------------------------------------------------------+
```

### Mobile (Vertical Stack)

```
+-----------------------------+
| [🎃] [ ▶ Run ] [ ↺ ]        |
+-----------------------------+
|                             |
|      Code Editor            |
|     (Min height 60%)        |
|                             |
+-----------------------------+
|      Output / Errors        |
|     (Auto-expand on run)    |
+-----------------------------+
```

## 3. Component Architecture

### A. `<PumpkinIDE />` (Container)

* **State:**
  * `code`: string (Current source)
  * `output`: string[] (Stdout lines)
  * `error`: PumpkinError | null
  * `isRunning`: boolean
* **Responsibility:**
  * Manages the Web Worker.
  * Handles "Run" click.
  * Coordinates layout.

### B. `<CodeEditor />`

* **Lib:** **CodeMirror 6** (Lighter/Better mobile support than Monaco).
* **Features:**
  * Syntax Highlighting (Custom Lezer grammar for Pumpkin).
  * Line Numbers.
  * Auto-close brackets.
  * *Nice to have:* Error squiggle underlining (using `error.location`).

### C. `<Console />`

* **Appearance:**
  * Dark background (Terminal style).
  * Monospace font.
* **Features:**
  * Auto-scroll to bottom.
  * Selectable text.
  * Rendering `ExecutionResult.output` array.

### D. `<ControlBar />`

* **Primary Action:** **"Run" Button**.
  * Green, Pill-shaped, Play Icon + Text.
  * Loading Spinner when `isRunning`.
* **Secondary Action:** **"Reset" Button**.
  * Grey/Ghost, Refresh Icon.
  * Resets code to "Hello World" template.

## 4. Interaction Flow

1. **Load:**
    * IDE mounts.
    * Worker initializes WASM (Show "Loading Pumpkin..." spinner).
    * Default "Hello World" code appears in Editor.

2. **Edit:**
    * User types.
    * State `code` updates.
    * (Optional) Debounced syntax check runs in background.

3. **Run:**
    * User clicks "Run".
    * UI sets `isRunning = true`.
    * Message sent to Worker: `{ type: "EXECUTE", source: code }`.
    * Console clears previous output.

4. **Result:**
    * Worker responds with `{ success, output, error }`.
    * UI sets `isRunning = false`.
    * UI updates `output` state (displayed in Console).
    * If `error`:
        * Error Panel appears / Console shows error.
        * Editor draws red underline at `error.location`.

## 5. Visual Style (Theme)

* **Palette:**
  * **Primary:** `#FF7518` (Pumpkin Orange) - for Brand/Accents.
  * **Success:** `#4CAF50` (Play Green).
  * **Bg:** White/Light Grey (Editor), Dark Grey (Console).
* **Typography:**
  * UI: Inter / Sans-serif (Friendly).
  * Code: Fira Code / JetBrains Mono (Readable).

## 6. Implementation Steps

1. Set up React components structure.
2. Integrate CodeMirror 6.
3. Connect to `playground.worker.ts` (created in Phase 1 specs).
4. Style with Tailwind CSS (assuming website stack).
