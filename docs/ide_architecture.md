# IDE Technical Architecture (Frontend) 🏗️

**Goal:** A responsive, non-blocking IDE for Pumpkin.
**Tech Stack:** React, CodeMirror 6, Pumpkin WASM, Web Workers.

> **Decision Note:** We selected **CodeMirror 6** over Monaco Editor to ensure mobile usability and faster initial load times (< 500KB bundle goal).

## 1. Component Tree 🌳

```mermaid
graph TD
    Page[PlaygroundPage] --> IDE[PumpkinIDE (Container)]
    IDE --> Toolbar[ControlBar]
    IDE --> Split[ResizableSplitPane]
    Split --> Editor[CodeEditor (CodeMirror)]
    Split --> Console[Console (Output Display)]
    
    IDE -.-> Worker[Web Worker (Pumpkin Runtime)]
```

### Components

* **PumpkinIDE:** The "Brain". Manages state, worker communication, and layout.
* **CodeEditor:** Pure component. Wraps CodeMirror. Emits `onChange`.
* **Console:** Renders ANSI/Text output. Auto-scrolls. Displays distinct Error blocks.
* **Web Worker:** The remote execution environment.

## 2. State & Data Flow 🌊

We use a **Unidirectional Data Flow** with one major cycle during execution.

### State Model

```typescript
interface IDEState {
  code: string;           // The source code
  isRunning: boolean;     // UI Loading state
  output: LogEntry[];     // Stdout history
  error: RuntimeError | null; // execution failure
}
```

### Execution Cycle

1. **User Input:** User types in `<CodeEditor />`. `code` state updates.
2. **Trigger:** User clicks "Run". `<PumpkinIDE />` sets `isRunning = true`.
3. **Dispatch:** Main Thread posts message to Worker: `{ type: 'EXECUTE', source: code }`.
4. **Execution (Worker):**
    * Worker receives message.
    * Passes source to WASM `vm.run()`.
    * WASM captures stdout.
    * WASM returns `ExecutionResult`.
5. **Response:** Worker posts message back: `{ type: 'SUCCESS', output: [...] }`.
6. **Update:** Main Thread receives message. Sets `isRunning = false`. Updates `output` / `error`.

## 3. Web Worker Architecture 🧵

**Rule:** Main thread **NEVER** executes Pumpkin code.

* **Why?** Infinite loops (`while true`) would freeze the browser UI.
* **Isolation:** The Worker runs in a separate thread. If it hangs, the "Stop" button on the UI (Main Thread) can terminate the Worker and spawn a fresh one.

### Worker Lifecycle

1. **Init:** Worker is spawned when `<PumpkinIDE>` mounts.
2. **Run:** Processes one execution request at a time.
3. **Reset/Stop:** If user clicks "Reset" or execution times out (> 5s), `worker.terminate()` is called, and a new Worker is created.

## 4. Error Handling Strategy 🛡️

Errors must be structured, not just strings.

**WASM Contract:**

```rust
struct ExecutionResult {
    success: bool,
    output: Vec<String>,
    error: Option<PumpkinError>, // Structured: { message, line, hint }
}
```

**Frontend Handling:**

1. **Console:** Renders the error message in Red box.
2. **Editor:** Highlights the specific line number returned in `error.line`.
3. **Toast:** (Optional) Show a fleeting "Execution Failed" toast if console is hidden.

## 5. Performance Considerations 🚀

* **WASM Loading:** Async load `pumpkin_core_bg.wasm`. Show "Booting..." spinner.
* **Bundle Size:**
  * CodeMirror is tree-shaken.
  * WASM should be gzip/brotli compressed.
* **Debouncing:** Editor `onChange` does **not** trigger re-renders of the expensive Console component.
* **Virtualization:** (Future) If Console output > 1000 lines, use list virtualization to prevent DOM lag.

## 6. Security Limits 🔒

* **Time Limit:** 5 seconds execution max (enforced by `setTimeout` watchdog in Main Thread).
* **Memory:** WASM memory limit set at compile time (e.g., 512MB).
* **No IO:** Worker has no implementation for File System or Network XHR.
