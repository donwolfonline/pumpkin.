# Execution Engine API (JS ↔ WASM)

> **Status:** Authoritative
> **Role:** Interface Definition
> **Orchestrator:** Browser Main Thread (JavaScript/TypeScript)
> **Engine:** Rust Core via WebAssembly

## 1. Overview

The Pumpkin Execution Engine follows a **Split-Stack Architecture**:

1. **Compiler Layer (JavaScript/TypeScript):**
    * **Responsibility:** Tokenization, Parsing, AST Generation.
    * **Reasoning:** Leveraging `ohm-js` (JS library) allows for rapid grammar iteration and easier error message formatting on the frontend.
    * **Output:** JSON-serialized Pumpkin AST.

2. **Runtime Layer (Rust WASM):**
    * **Responsibility:** Interpretation, State Management, Resource limits.
    * **Reasoning:** Performance, correctness, and shared logic with the CLI.
    * **Input:** JSON-serialized Pumpkin AST.

---

## 2. API Reference

### 2.1. JavaScript Interface (Orchestrator)

These functions are available in the browser context (Web Worker).

#### `compile(source: string): Result<string, ParseError>`

Converts raw source code into a JSON-serialized AST string.

* **Input:**
  * `source` (string): The raw Pumpkin code.
* **Output:**
  * **Success:** JSON string representing the `Program` AST node.
  * **Failure:** Throws a `ParseError` containing `{ message, line, col }`.
* **Implementation:** Calls `src/parser.ts` -> `ohm-js`.

#### `run(astJson: string): ExecutionResult`

Executes the compiled AST within the Persistent VM.

* **Input:**
  * `astJson` (string): The JSON string returned from `compile()`.
* **Output:**
  * Returns an `ExecutionResult` object.
* **Implementation:** Calls `wasm_bindgen` -> `PumpkinVM.run()`.

#### `reset()`

Clears the runtime environment (variables, memory) without destroying the worker.

* **Input:** None.
* **Action:** Discards the old `PumpkinVM` instance and creates a new one.

---

### 2.2. WASM Interface (Rust Engine)

These definitions reside in `pumpkin_core/src/wasm.rs` and are exposed via `wasm-bindgen`.

```rust
#[wasm_bindgen]
pub struct PumpkinVM {
    env: Environment,
}

#[wasm_bindgen]
impl PumpkinVM {
    /// Creates a fresh VM with a clean global environment.
    #[wasm_bindgen(constructor)]
    pub fn new() -> PumpkinVM;

    /// Executes a JSON-serialized AST.
    /// Returns a JS Object matching the ExecutionResult interface.
    pub fn run(&self, ast_json: &str) -> JsValue;

    /// Optional: Validates if the AST is compatible with this runtime version.
    pub fn validate(&self, ast_json: &str) -> bool;
}
```

---

## 3. Data Structures

### 3.1. ExecutionResult (Shared Interface)

This data structure is passed from Rust to JS upon completion.

```typescript
interface ExecutionResult {
    // True if the program ran to completion without runtime errors
    success: boolean;

    // Standard Output (show statements) captured during execution
    output: string[];

    // Return value of the last expression (if any)
    return_value?: any;

    // If success is false, this object is populated
    error?: {
        type: "Runtime" | "System";
        message: string; // Friendly message
        cause?: string;  // Technical detail
        line?: number;   // Source line number
    };
}
```

### 3.2. AST Format (JSON Verification)

The JSON bridge requires strict adherence to the AST structure.

**Example `Program` Node:**

```json
{
  "type": "Program",
  "body": [
    {
      "type": "LetStmt",
      "varName": "x",
      "value": {
        "type": "NumLit",
        "val": 10
      }
    }
  ]
}
```

## 4. Error Propagation Flow

1. **Parse Error (JS side):**
    * Caught immediately in `compile()`.
    * Never reaches WASM.
    * Returned to UI as `Syntax Error`.

2. **Runtime Error (Rust side):**
    * Caught by `interpreter.rs` loop.
    * Packaged into `ExecutionResult { success: false, error: ... }`.
    * Returned to UI as `Runtime Error`.

3. **System Panic (Rust side):**
    * Caught by `console_error_panic_hook`.
    * Logs stack trace to browser console.
    * Worker might crash; UI Watchdog handles the restart.
