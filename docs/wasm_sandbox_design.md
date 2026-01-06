# WASM Execution Sandbox Design

> **Status:** Draft
> **Goal:** Safe execution of untrusted user code in the browser.
> **Constraint:** Browser freeze prevention (No infinite loops).

## 1. Threat Model

In the context of the Pumpkin Playground, "malicious" code is primarily code that:

1. **Consumes excessive CPU:** Causes the browser tab to freeze (Infinite Loops).
2. **Consumes excessive Memory:** Crashes the tab (Allocation Bombs).
3. **Attempts unauthorized access:** Reads cookies/storage (Impossible by default in WASM, but good to note).

We are **not** currently defending against side-channel attacks (Spectre) as this is a toy language, but we must prevent denial-of-service against the user's own browser.

## 2. Layered Defense Architecture

We will employ a "Defense in Depth" strategy with three concentric layers.

### Layer 1: The Rust Interpreter (Instruction Counting)

**Mechanism:** "Gas" Limit

* **Concept:** Every AST node visited or statement executed decrements a global `fuel` counter.
* **Implementation:**
  * Add `max_instructions` to `InterpreterConfig`.
  * In the main loop of `execute_in_env`, call `tick()`.
  * If `instructions_executed > max_instructions`, return `PumpkinError::ResourceExhausted`.
* **Pros:** Graceful failure. Returns a proper error message ("Execution halted: operational limit exceeded"). Does not crash the worker.
* **Cons:** Slight performance overhead (negligible for toy language).

### Layer 2: The Web Worker (Thread Isolation)

**Mechanism:** UI Non-Blocking

* **Concept:** Running code on the main thread freezes the UI.
* **Implementation:**
  * All parsing and WASM execution happens inside `pumpkin.worker.js`.
  * Even if the WASM internally infinite loops (due to a bug in Layer 1), the Main Thread UI remains responsive.

### Layer 3: The Main Thread Watchdog (Hard Termination)

**Mechanism:** "Kill Switch"

* **Concept:** If Layer 1 fails and the worker hangs, we need to restart it.
* **Implementation:**
  * `PumpkinIDE` sets a 5-second timeout upon sending `EXECUTE`.
  * If no response is received by T+5s:
        1. Call `worker.terminate()`.
        2. Show error: "Execution Timed Out (Infinite Loop?)".
        3. Respawn a fresh worker instance.
* **Pros:** Ultimate safety net.
* **Cons:** Loses worker state (but that's acceptable for a crash).

## 3. Implementation Specifications

### 3.1. CPU Limit (Instruction Counter)

Estimated capacity needed for "educational" programs:

* Standard "Hello World": ~50-100 ops.
* Complex sorting algorithm (N=100): ~500,000 ops.
* **Proposal:** Set default limit to **1,000,000 instructions**. This allows decent complexity but stops infinite loops in < 200ms.

```rust
// pumpkin_core/src/interpreter.rs
pub struct Interpreter {
    instructions_executed: usize,
    max_instructions: usize,
}

impl Interpreter {
    fn tick(&mut self) -> Result<(), PumpkinError> {
        self.instructions_executed += 1;
        if self.instructions_executed > self.max_instructions {
            return Err(PumpkinError::runtime("Execution Limit Exceeded (Infinite Loop?)"));
        }
        Ok(())
    }
}
```

### 3.2. Memory Limit (WASM)

* **Mechanism:** `WebAssembly.Memory` arguments.
* **Limit:** Start with 10 pages (640KB), max 100 pages (6.4MB).
* **Reasoning:** Pumpkin is a toy language; it shouldn't need GBs of RAM. 6.4MB is plenty for any reasonable assortment of strings and numbers.

```javascript
// pumpkin.worker.js initialization
const wasmMemory = new WebAssembly.Memory({
    initial: 10,
    maximum: 100 // Hard cap ~6.4MB
});
```

### 3.3. Output Buffer Limit

* **Threat:** `while(true) { show "spam" }`
* **Defense:** Cap the output vector in Rust.
* **Limit:** Max 1000 output entries.
* **Action:** If `output.len() > 1000`, stop appending or (better) halt execution with "Too much output".

## 4. Failure Modes & User Feedback

| Failure Mode | Trigger | System Response | User Message |
| :--- | :--- | :--- | :--- |
| **Logic Loop** | `loop { x = x + 1 }` | Layer 1 (Instruction Count) hits 1M | `Runtime Error: Execution limit exceeded. Infinite loop detected?` |
| **Log Spam** | `loop { show "hi" }` | Output buffer > 1000 | `Runtime Error: Output limit exceeded (1000 lines).` |
| **Heavy Comp** | Calculating Fibonacci(100) | Layer 1 hits 1M | `Runtime Error: Computation too complex (Instruction limit reached).` |
| **Worker Hang** | Rust Bug / Panic in Loop | Layer 3 (Watchdog) fires | `System Error: Execution timed out. The runtime crashed.` |

## 5. Security Checklist

* [ ] **No FS Access:** WASM imports should NOT include Node.js `fs` or other system bindings.
* [ ] **No Network:** WASM imports should NOT include `fetch` or `XMLHttpRequest`.
* [ ] **Strict Typed Array Passing:** Only pass flattened arrays/strings between JS and Rust, no complex object references that could lead to prototype pollution.
