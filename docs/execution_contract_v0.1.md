# Execution Contract v0.1 📜

**Status:** Frozen ❄️
**Version:** 0.1
**Parties:** TypeScript Frontend (Client) ↔ Rust Core (WASM Host)

This document defines the strict data contracts for executing Pumpkin programs in the browser.

## 1. Execution Request

**Direction:** TS ➡️ Rust

The input is a single JSON object representing the full AST.

### TypeScript Interface

```typescript
// See src/ast/nodes.ts for full node definitions
interface Program {
  kind: "Program";
  body: Statement[];
  loc?: SourceLocation;
}

// Function signature
function run(program: Program): ExecutionResult;
```

### JSON Example

```json
{
  "kind": "Program",
  "body": [
    {
      "kind": "ShowStmt",
      "expression": { "kind": "Literal", "value": "Hello", "raw": "\"Hello\"" }
    }
  ]
}
```

## 2. Execution Result

**Direction:** Rust ➡️ TS

The output is a single JSON object containing everything needed to render the result.

### TypeScript Interface

```typescript
interface ExecutionResult {
  /** True if the program ran to completion without panic or runtime error */
  success: boolean;
  
  /** Captured stdout (e.g. from `show` statements) */
  output: string[];
  
  /** The final value of the last expression (if any) */
  returnValue: PumpkinValue | null;
  
  /** Structured error if success is false */
  error?: PumpkinError;
}

type PumpkinValue = 
  | { type: "number", value: number }
  | { type: "string", value: string }
  | { type: "boolean", value: boolean }
  | null;
  // Note: Rust serialization of enums might differ slightly, verification needed below.
```

### Rust Struct (`pumpkin_core`)

```rust
#[derive(Serialize)]
pub struct ExecutionResult {
    pub success: bool,
    pub output: Vec<String>,
    pub return_value: Option<PumpkinValue>,
    pub error: Option<PumpkinError>,
}
```

## 3. Error Protocol

Errors are structured to allow the frontend to render nice UI (red highlights, tooltips).

### TypeScript Interface

```typescript
type PumpkinError = 
  | { 
      kind: "RuntimeError"; 
      message: string; 
      location?: SourceLocation; 
      hint?: string; 
    }
  | { 
      kind: "TypeError"; 
      expected: string; 
      actual: string; 
      location?: SourceLocation; 
    }
  | { 
      kind: "UndefinedVariableError"; 
      name: string; 
      location?: SourceLocation; 
      hint?: string; 
    }
  | { 
      kind: "DivisionByZeroError"; 
      location?: SourceLocation; 
    };

interface SourceLocation {
  start: number;
  end: number;
  line: number; // 1-indexed
  col: number;  // 1-indexed
}
```

### Rust Struct

```rust
#[derive(Serialize)]
#[serde(tag = "kind")]
pub enum PumpkinError {
    RuntimeError { ... },
    TypeError { ... },
    UndefinedVariableError { ... },
    DivisionByZeroError { ... },
}
```

## 4. Integration Notes

1. **Serialization:** We use `serde_json` on Rust side.
2. **Enums:** Rust enums are serialized with `#[serde(tag = "kind")]` to match the TS discriminated unions.
3. **Values:** `PumpkinValue` serialization needs to match TS expectations.
    * *Rust:* `PumpkinValue::Number(5.0)` -> `5.0` (untagged? or default serde enum?)
    * *Correction:* In `value.rs`, `PumpkinValue` is an enum. By default serde serializes enums as `{"Number": 5.0}`.
    * *Requirement:* The frontend likely expects raw values or specific tagged values.
    * *Decision:* For v0.1, we accept `{"Number": 5.0}` style or simple `5.0` if configured.
    * *Recommendation:* Use `#[serde(untagged)]` for `PumpkinValue` if we want it to look like raw JSON values (e.g. `5` instead of `{"Number": 5}`).
