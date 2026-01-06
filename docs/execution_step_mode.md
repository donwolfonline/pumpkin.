# Step-by-Step Execution Mode Design

> **Status:** Draft
> **Goal:** Allow users to execute Pumpkin code one line at a time.
> **Constraint:** Rust interpreter is recursive (synchronous). Cannot yield easily.

## 1. The Challenge

The Pumpkin interpreter uses a **Recursive Tree-Walker**. The execution state (variables, control flow) lives on the Rust call stack.

* **Problem:** We cannot "pause" a recursive Rust function and return to JS, then "resume" later, without a massive rewrite (e.g., creating a bytecode VM or using unstable async generators).
* **Solution:** **Worker Suspension Pattern**.

## 2. Architecture: Worker Suspension

We leverage the fact that Pumpkin execution happens in a dedicated Web Worker. We can **block** the worker thread entirely using `Atomics.wait`.

### 2.1. Mechanism

1. **Shared Memory:**
    * Main Thread creates a `SharedArrayBuffer` (1 integer, initialized to `0`).
    * Passes it to the Worker.
2. **Execution Loop (Rust):**
    * Before executing any `Statement`, Rust calls a JS callback `on_step(line_number)`.
3. **Blocking (JS Worker):**
    * Inside `on_step`, the Worker sends a `PAUSED` message to the Main Thread (with current variables/line).
    * Worker calls `Atomics.wait(sharedBuffer, 0, 0)`.
    * **The Worker is now asleep.** It consumes 0 CPU. State is preserved on the stack.
4. **Resuming (Main Thread):**
    * User clicks "Step".
    * Main Thread changes `sharedBuffer` value to `1` and calls `Atomics.notify`.
    * Worker wakes up, returns from `on_step`, and Rust continues.

### 2.2. Diagram

```mermaid
sequenceDiagram
    participant UI as Main Thread
    participant SAB as SharedArrayBuffer
    participant Worker
    participant Rust as Rust VM

    UI->>Worker: RUN (Debug Mode)
    Worker->>Rust: execute()
    
    Rust->>Rust: stmt 1 (line 10)
    Rust->>Worker: on_step(10)
    Worker->>UI: POST "PAUSED_AT_LINE_10"
    Worker->>SAB: Atomics.wait(0, 0) (BLOCKS)
    
    Note right of UI: UI Highlights Line 10
    Note right of UI: User clicks "Step"
    
    UI->>SAB: Store 1, Notify
    SAB-->>Worker: Wake up
    Worker-->>Rust: Return
    
    Rust->>Rust: stmt 2 (line 11)
    ...
```

## 3. API & Data Structures

### 3.1. Hook Injection

The `run` function needs a new optional callback.

```rust
// pumpkin_core/src/wasm.rs
pub fn run(
    &self, 
    ast_json: &str, 
    on_output: &js_sys::Function, 
    move_step: Option<&js_sys::Function> // New
) -> JsValue
```

### 3.2. Snapshot Data

When the worker pauses, it should send a snapshot of the current state so the UI can visualize variables.

* **Structure:**

    ```typescript
    interface DebugSnapshot {
        line: number;
        variables: Record<string, string>; // e.g. { "count": "1", "name": "Pumpkin" }
    }
    ```

* **Rust Logic:**
  * The `on_step` callback in Rust should serialize the current `Environment` scope to a Map/Object and pass it to JS.
  * (Requires adding `env.snapshot()` to the Rust `Environment` struct).

## 4. UI Controls & States

### 4.1. States

* **Idle:** Editor is editable.
* **Running:** Standard execution (no stepping).
* **Debugging:** Worker launched with `debug: true`.
  * **Paused:** Worker blocked, "Step" button active.
  * **Busy:** Worker executing (between steps).

### 4.2. Action Bar

* **Play/Run:** Executed normally (ignoring breakpoints).
* **Debug:** Starts execution but pauses at Line 1.
* **Step Over:** Advances to the next line.
* **Stop:** Terminates the worker.

## 5. Requirements

* **COOP/COEP Headers:** `Same-Origin-Opener-Policy` and `Embedder-Policy` headers must be set on the server to enable `SharedArrayBuffer` security requirements.
  * *Note:* Vercel supports this via `next.config.js`.

## 6. Fallback

If `SharedArrayBuffer` is not available (some browsers or restrictive environments), the `Debug` button should be disabled or fall back to "Run to Completion".
