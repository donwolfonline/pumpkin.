# Pumpkin Project Architecture

This document explains the high-level structure of the Pumpkin repository. It is intended for contributors and those curious about how the language is built.

## 1. Directory Structure

```text
pumpkin/
├── pumpkin_core/   # The Rust implementation (Bytecode VM, Compiler)
├── src/            # (Legacy) TypeScript implementation & CLI wrappers
├── grammar/        # Ohm.js grammar definition
├── website/        # Next.js documentation and landing site
├── examples/       # Pumpkin source code examples
└── docs/           # Documentation markdown files
```

## 2. Core Components (`pumpkin_core`)

This is the heart of Pumpkin v0.2, written in Rust for performance and correctness.

* `vm.rs`: The Stack-Based Virtual Machine. Executes bytecode instructions.
* `compiler.rs`: Translates the AST (mostly handled by the parser) into Bytecode Chunks.
* `chunk.rs`: Defines the bytecode format (OpCodes) and constants.
* `value.rs`: Defines the runtime value types (`PumpkinValue`).

## 3. Frontend (`src` & `grammar`)

The frontend handles text processing before execution.

* **Grammar**: Defined in `grammar/pumpkin.ohm`. It uses Ohm.js, a PEG-based parser generator, to handle the "human-friendly" syntax (keywords like `show`, `repeat`, `ask`).
* **Parser**: Currently, the parser logic (often in TypeScript/JS in the v0.1 era) bridges the gap to the Rust core or previous TS interpreter.

## 4. Web Assembly (WASM)

To run Pumpkin in the browser (like on the Playground), we compile `pumpkin_core` to WebAssembly.
This allows the heavy lifting of the VM to run client-side with near-native speed.

## 5. Website (`website`)

Built with **Next.js 14** and **Tailwind CSS**.

* `app/page.tsx`: The landing page.
* `app/docs/`: The documentation hub.
* `components/`: Reusable UI components (like the standard `Navbar` or documentation widgets).
