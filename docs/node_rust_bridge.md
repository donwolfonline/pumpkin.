# Node.js ↔ Rust Bridge Architecture 🌉

**Approach:** WASM in Node.js

## 1. Justification

We have chosen **WebAssembly (WASM)** over native binary execution for the v0.1 CLI.

* **Unified Build:** We accept the slight performance penalty to maintain a single build target for both Browser (Playground) and CLI. Scope boundaries are identical.
* **Distribution:** `wasm-pack` generates an npm-compatible package. Users can `npm install pumpkin` without needing a Rust toolchain or pre-compiled native binaries for their specific OS/Arch.
* **Security:** The WASM sandbox naturally prevents the core from accessing the filesystem or network unless explicitly allowed via the Host interface (which we control in JS).

## 2. Invocation Flow

1. **User Runtime:** `pumpkin run script.pumpkin`
2. **CLI (Node.js):**
    * Reads `script.pumpkin` from disk.
    * Parses source -> JSON AST (using existing Ohm parser).
    * Initializes `pumpkin_core.wasm`.
3. **WASM Boundary:** Calls `vm.run(json_ast)`.
4. **Rust Core:** Executes logic, captures `show` output in memory.
5. **Return:** Returns `ExecutionResult` (JSON) to Node.js.
6. **CLI (Node.js):**
    * Iterates `result.output` and prints to `process.stdout`.
    * If `result.error` exists, pretty-prints it to `process.stderr` and exits with code 1.

## 3. Error Propagation

The Rust core **never** panics or prints. It returns a structured error object.

* **Rust:** Returns `{ success: false, error: { kind: "RuntimeError", ... } }`
* **Node.js:** Detects `success: false`. Formats the error using the `hint` and `location` fields (e.g. using `chalk` for red text) and prints to stderr.

## 4. Implementation Details

### Rust Side (`src/lib.rs` / `src/wasm.rs`)

Already implements `PumpkinVM` which is compatible.

### Node.js Side (`src/cli.ts`)

Needs to dynamically import the WASM module.

```typescript
// Proposed Implementation
import fs from 'fs';
import { parseToAST } from './parser'; // Existing
import init, { PumpkinVM } from '../pumpkin_core/pkg/pumpkin_core.js';

async function executeFile(path: string) {
  // 1. Init WASM
  await init(fs.readFileSync(require.resolve('../pumpkin_core/pkg/pumpkin_core_bg.wasm')));
  const vm = new PumpkinVM();

  // 2. Parse
  const code = fs.readFileSync(path, 'utf-8');
  const ast = parseToAST(code);

  // 3. Execute
  const result = vm.run(JSON.stringify(ast));

  // 4. Handle Output
  result.output.forEach(line => console.log(line));

  // 5. Handle Error
  if (!result.success) {
    console.error(`🚨 ${result.error.kind}: ${result.error.message}`);
    process.exit(1);
  }
}
```
