# IDE Roadmap (v0.2+) 🔮

**Goal:** Evolve from a "Text Editor" to a "Visual Learning Tool".
**Rule:** Don't outgrow the user. If it looks like VS Code, we failed.

## 1. The "Visual Execution" Era (v0.2)

For v0.2, we want to peel back the curtain on how code runs.

### A. The Variable Inspector 🧐

* **What:** A side panel showing the current value of every variable.
* **Why:** Beginners struggle to visualize state changes (e.g., `x = x + 1`).
* **UX:** Updates in real-time if running in "Slow-Mo", or shows final state after run.

### B. "Slow-Mo" Run Mode 🐌

* **What:** A "Turtle" button next to "Run".
* **Effect:** Executes code with a 500ms delay per line. Highlights the active line.
* **Why:** Helps users see the Flow of Control (especially loops jumping back).

### C. Step-Through Debugger ⏯️

* **What:** "Step" button.
* **Effect:** Pauses execution after each line.
* **Why:** Critical for teaching debugging without teaching "Breakpoints".

## 2. The "Creative Coding" Era (v0.3)

Once logic is visual, we want Output to be visual.

### A. Pumpkin Graphics (Turtle) 🐢

* **What:** A canvas overlay.
* **Commands:** `draw.move(10)`, `draw.turn(90)`.
* **Why:** Graphics are the stickiest way to learn loops.

### B. Audio/Synth 🎵

* **What:** `play.note("C4")`.
* **Why:** Music coding is incredibly engaging for non-visual learners.

## 3. The Anti-Roadmap (What NOT to build) 🚫

We explicitly reject features that make Pumpkin feel like "Work".

* ❌ **File System / Project Tree:** Users should work on *one idea* at a time. No folders. No `main.pumpkin`.
* ❌ **Git / GitHub Integration:** Too complex. Sharing happens via Links/Copy-Paste.
* ❌ **IntelliSense / Autocomplete:** Often distracting. Beginners need to type to memorize syntax.
* ❌ **Vim Mode:** ...No.
* ❌ **Tabs:** One file only. Focus.

## 4. Summary

Pumpkin IDE v0.1 is a **Playground**.
Pumpkin IDE v0.2 will be a **Laboratory**.
It will never be a **Workstation**.
