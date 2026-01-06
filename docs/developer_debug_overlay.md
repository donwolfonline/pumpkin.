# Developer Debug Overlay Design

> **Status:** Authoritative
> **Goal:** Provide advanced introspection tools for contributors and power users without cluttering the UI for beginners.
> **Principle:** "Powerful, but invisible."

## 1. Access Control

The overlay is hidden by default. It can be toggled via:

1. **URL Query Parameter:** `?debug=true` (Persists via session storage).
2. **Keyboard Shortcut:** `Ctrl + Shift + D` (or `Cmd + Shift + D` on Mac).
3. **Konami Code:** A fun easter egg for students who find it.

When active, a small 🛠️ icon appears in the footer next to the version number.

## 2. Overlay Layout

The overlay renders as a **Side Drawer** sliding in from the right, covering 40% of the screen.

### 2.1. Tabs

The drawer contains three primary tabs:

1. **AST Viewer:** Visualizes the code structure.
2. **Trace Log:** Detailed execution history.
3. **Memory Inspector:** Current VM state.

---

## 3. Features

### 3.1. AST Viewer (The "What")

* **Input:** The JSON output from `ohm-js`.
* **Visualization:** Interactive Tree View (e.g., `react-json-view`).
* **Interaction:** Hovering a node highlights the corresponding code in the editor.
* **Why:** Verifies that the parser is understanding the code correctly.

### 3.2. Execution Trace (The "When")

* **Mechanism:** When enabled, the Worker sends `TRACE` messages for every executed statement.
* **Data:** Timestamp, Statement Type, Line Number, Elapsed Time.
* **Why:** Identifies performance bottlenecks (e.g., "Why is my loop slow?") and execution flow bugs.

### 3.3. Memory Snapshot (The "Where")

* **Mechanism:** Queries the Rust `Environment`.
* **Visualization:** Table of all active scopes and variables.
  * *Global Scope* -> `x: 10`
  * *Function Scope* -> `arg: "hello"`
* **Why:** Debugs variable shadowing and scope leakage issues.

## 4. Architecture

### 4.1. Worker Integration

The `EXECUTE` message to the worker gains a `trace: boolean` flag.

```typescript
// Incoming to Worker
{
  type: 'EXECUTE',
  source: code,
  options: {
    trace: true
  }
}
```

If `trace` is true, the Rust VM emits granular events that the overlay consumes.

### 4.2. Performance Warning

The overlay shows a banner: *"Performance mode disabled. Execution may be slower when Debug Tools are open."*

## 5. Implementation Roadmap

1. **Stage 1:** Implement the "Secret Handshake" (Shortcuts/URL).
2. **Stage 2:** Add minimal AST Viewer (JSON dump).
3. **Stage 3:** Wire up Rust tracing events.

This tool transforms the IDE from a toy into a legitimate compiler development workbench.
