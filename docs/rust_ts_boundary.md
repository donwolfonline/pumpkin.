# Rust ↔ TypeScript Boundary Design 🌉

**Goal:** Execute Pumpkin code in the browser via WebAssembly (WASM).

## 1. High-Level Architecture

```text
[Browser / Node.js] (TypeScript)
       │
       ▼
   (Ohm Parser) -> Source Code -> JSON AST String
       │
       ▼
[WASM Boundary] (wasm-bindgen)
       │
       ▼
   (Serde) -> JSON String -> Rust AST Structs
       │
       ▼
[Rust Core] (Interpreter) -> ExecutionResult -> JSON String
       │
       ▼
[TypeScript] JSON.parse(result) -> Output/Errors
```

## 2. The Contract

### 2.1 Input: `ExecutionRequest`

Passed from TS to Rust.

```typescript
// defined in TS
interface ExecutionRequest {
    astJson: string; // The full Program node serialized
    // Future: flags, options, strictMode
}
```

### 2.2 Output: `ExecutionResult`

Returned from Rust to TS.

```typescript
// defined in TS
interface ExecutionResult {
    success: boolean;
    output: string[]; // Captured stdout (show statements)
    returnValue: any; // Final expression value (if any)
    error?: {
        kind: 'Runtime' | 'Type' | 'System';
        message: string;
        line?: number;
        col?: number;
    };
}
```

## 3. Rust WASM Interface (`lib.rs`)

We use `wasm-bindgen` to expose a class `PumpkinVM`.

```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct PumpkinVM {
    // Internal state (Environment) persists between run() calls
    env: Environment, 
    output_buffer: Vec<String>,
}

#[wasm_bindgen]
impl PumpkinVM {
    #[wasm_bindgen(constructor)]
    pub fn new() -> PumpkinVM {
        utils::set_panic_hook(); // Safety first
        PumpkinVM {
            env: Environment::new(),
            output_buffer: Vec::new(),
        }
    }

    pub fn run(&mut self, ast_json: &str) -> JsValue {
        self.output_buffer.clear();
        
        let ast: Program = match serde_json::from_str(ast_json) {
            Ok(p) => p,
            Err(e) => return self.make_error("System", &format!("JSON AST Error: {}", e)),
        };

        // Execute
        let result = evaluate(&ast, &mut self.env, self); // self implements Host trait
        
        // Return Result as JS Object
        self.serialize_result(result)
    }
}

// Host Implementation captures output
impl Host for PumpkinVM {
    fn show(&self, msg: &str) {
        // self is immutable reference here in trait signature?
        // We might need RefCell or similar for output_buffer if Host signature is &self
        // Or change Host signature to &mut self (better for single threaded WASM)
    }
}
```

## 4. Panic Safety 🦺

Rust panics in WASM are fatal and hard to debug.
Rule: **Catch Unwind** is not easily available in all WASM targets, so we must rely on `Result` handling everywhere.

We use `console_error_panic_hook` to pipe Rust panics to JS `console.error` during development.

## 5. Integration Plan

1. **Build:** `wasm-pack build --target web`
2. **Load:** In TS: `import init, { PumpkinVM } from './pkg/pumpkin_core.js'`
3. **Run:** `await init(); const vm = new PumpkinVM(); vm.run(ast);`
