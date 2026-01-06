# Official Pumpkin Debugger API (v1.0)

> **Status:** Ratified
> **Target:** v1.0
> **Environments:** CLI (Rust), Web IDE (WASM).

## 1. Architecture

The Debugger is a **state machine** wrapping the VM. It intercepts the execution loop to inspect state, respecting the "Platform Agnostic" constraint by using a pure logic layer (`DebugAdapter`) separate from the UI.

### 1.1. Lifecycle States

1. **Initialized:** VM loaded, not started.
2. **Running:** Instructions are executing.
3. **Paused:** Execution suspended (by Breakpoint/Step).
4. **Terminated:** Execution finished (Success or Error).

## 2. API Design

### 2.1. The `DebugAdapter` Trait

Adapters implement this to receive events (CLI printer, WebSocket sender).

```rust
pub trait DebugAdapter {
    fn on_pause(&mut self, reason: StopReason, state: &VMState);
    fn on_output(&mut self, text: &str);
    fn on_error(&mut self, err: &PumpkinError);
}
```

### 2.2. The `DebugSession` Struct

The main controller.

```rust
struct DebugSession {
    vm: VM,
    breakpoints: HashSet<usize>, // Source Lines
    mode: RunMode,               // Continue, StepInto, StepOver
}

enum RunMode {
    Running,
    StepInto,
    StepOver { stack_depth: usize },
    StepOut { stack_depth: usize },
}
```

### 2.3. Control Methods

* `start()`: Enters the loop.
* `pause()`: Sets internal flag to stop at next instruction.
* `resume()`: Clears pause flag, resumes loop.
* `step_into()`: Execute one instruction.
* `step_over()`: Execute until next line in same frame.
* `step_out()`: Execute until return to parent frame.

## 3. Breakpoint Model

Breakpoints are **Line-Based**, mapped to **Instruction Offsets** by the compiler.

1. **Resolution:** When setting a break at Line `L`, the Session scans the `Chunk.lines` array for the *first valid instruction* with line >= `L`.
    * *Optimization check:* If `L` maps to no instruction (comment/empty line), it snaps to the next executable line.
2. **Storage:** Stored as `HashSet<usize>` (Lines) for easy UI toggling.
3. **Hit Condition:**

    ```rust
    // Inside VM step loop
    if session.breakpoints.contains(&current_chunk.lines[ip]) {
        return StopReason::Breakpoint;
    }
    ```

## 4. Inspection API

When Paused, the Session exposes a snapshot of the VM.

### 4.1. Call Stack

Returns list of `StackFrame` definitions.

```json
[
  { "id": 0, "name": "main", "line": 10, "file": "app.pumpkin" },
  { "id": 1, "name": "calculate", "line": 5, "file": "logic.pumpkin" }
]
```

### 4.2. Variables

Scoped lookup based on the selected Stack Frame.

* **Locals:** Resolved from Stack offsets relative to Frame BP.
* **Globals:** Resolved from Global HashMap.

## 5. Tracing Format

When tracing is enabled, the VM emits structured logs for tooling.

```json
{
  "event": "step",
  "ip": 45,
  "op": "ADD",
  "line": 12,
  "stack": ["10", "20"]
}
```

## 6. Implementation Strategy

1. **Core VM Refactor:**
    * Change `VM::run()` to `VM::run_with_hooks(hooks: &mut dyn Hooks)`.
    * Hooks define `pre_step(ip, op) -> ControlFlow`.
2. **DebugSession:**
    * Implements `Hooks`.
    * Manages the state machine (Running/Paused).
    * Handles the complex logic of "Step Over" (monitoring stack depth).
3. **WASM Glue:**
    * Expose `DebugSession` as a JS class.
    * Use JS callbacks for the `DebugAdapter` interface.

## 7. Error Handling

* **Internal Panic:** VM defines `catch_unwind` boundary to prevent crashing the host IDE.
* **User Error:** runtime exceptions pause the debugger (`StopReason::Exception`), allowing inspection of the state *at the moment of error*.
