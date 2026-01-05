# Pumpkin Repository Structure 📁

This document defines the authoritative folder and file structure for the **Pumpkin** programming language repository. All contributors should adhere to this layout to ensure maintainability and scalability.

## Tree View

```text
pumpkin/
├── bin/                 # Shell wrappers for local execution [Internal]
├── dist/                # Compiled JavaScript output (generated) [Internal]
├── docs/                # Project documentation and guides [Public]
├── examples/            # Example Pumpkin scripts for users [Public]
├── grammar/             # Language grammar definitions [Internal]
│   └── pumpkin.ohm      # The Ohm-js grammar file
├── src/                 # TypeScript source code [Internal/Public]
│   ├── ast/             # Abstract Syntax Tree definitions (Future) [Internal]
│   ├── stdlib/          # Standard Library implementations [Internal]
│   ├── cli.ts           # CLI Main Entry Point [Internal]
│   ├── environment.ts   # Runtime State & Scope Management [Internal]
│   ├── errors.ts        # Error Handling & Types [Public]
│   ├── index.ts         # Main Library Entry Point (Programmatic API) [Public]
│   ├── interpreter.ts   # AST Walker & Execution Engine [Internal]
│   ├── parser.ts        # Ohm-js Wrapper & CST Generation [Internal]
│   ├── repl.ts          # Read-Eval-Print Loop Logic [Internal]
│   └── run.ts           # File Execution Logic [Internal]
├── tests/               # Test Suites [Internal]
│   ├── smoke/           # End-to-End Smoke Tests
│   └── unit/            # Unit Tests (Jest/Mocha)
├── website/             # Marketing & Documentation Website [Public]
├── .gitignore           # Git ignore rules
├── package.json         # NPM manifest
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project Overview
```

## Module Responsibilities

### Root Directories

| Directory | Visibility | Responsibilities |
| :--- | :--- | :--- |
| **`bin/`** | Internal | Contains executable wrappers for testing the CLI locally without a full install. |
| **`dist/`** | Internal | Destination for compiled `.js` files and assets. Ignored by Git. |
| **`docs/`** | Public | Architecture notes, installation guides, and maintainer instructions. |
| **`examples/`** | Public | "Trinket" programs demonstrating language features to users. |
| **`grammar/`** | Internal | Holds the formal grammar specification (`.ohm`). Separated for clarity. |
| **`src/`** | Mixed | The core TypeScript codebase. |
| **`tests/`** | Internal | Automated verification. `smoke/` for E2E CLI tests, `unit/` for function-level tests. |
| **`website/`** | Public | Source code for the landing page and documentation site. |

### Source (`src/`) Components

| File/Folder | Visibility | Responsibilities |
| :--- | :--- | :--- |
| **`cli.ts`** | Internal | **CLI Entry Point.** Parses arguments (`run`, `repl`) and invokes `run.ts` or `repl.ts`. |
| **`index.ts`** | Public | **Library Entry Point.** Exports `parse()`, `evaluate()`, and `run()` for other tools to use Pumpkin programmatically. |
| **`parser.ts`** | Internal | Wraps Ohm.js. Reads `grammar/pumpkin.ohm` and converts source code to a MatchResult. |
| **`interpreter.ts`**| Internal | **The Brain.** Walks the CST/AST and performs actions. Contains `evaluate()`. |
| **`environment.ts`**| Internal | **Memory.** Manages variable storage, scopes, and closure contexts. |
| **`errors.ts`** | Public | Defines `PumpkinError` classes. Formats "friendly" error messages. |
| **`repl.ts`** | Internal | usage logic for the Interactive Shell. Handles multi-line input buffering. |
| **`stdlib/`** | Internal | Native TypeScript functions exposed to Pumpkin (e.g., File I/O, Math helpers). |

## Scaling Notes (v0.1 → v1.0)

* **Grammar:** `pumpkin.ohm` is currently in the root but should move to `grammar/` as the language grows.
* **StdLib:** As the standard library grows, break `stdlib/` into `io.ts`, `math.ts`, `string.ts`, etc.
* **AST:** Currently we use Ohm's MatchResult directly. For v1.0, we may introduce an explicit `src/ast/` folder to define strict TypeScript interfaces for Nodes.
