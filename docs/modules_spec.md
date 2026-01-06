# official Module & Import System Specification (v1.0)

> **Status:** Ratified
> **Target:** v1.0
> **Philosophy:** "Simple, Static, Safe."

## 1. Introduction

The Pumpkin Module System enables code organization across multiple files while maintaining strict determinism. It enforces a **Directed Acyclic Graph (DAG)** dependency structure, preventing shared-state confusion common in circular dependencies.

## 2. Syntax

### 2.1. Import Statement

Imports are declarative and must occur at the **top-level** of a file, before any other statements.

```pumpkin
import "string"          # Standard Library
import "./utils/math"    # Relative path
```

* **Constraint:** `import` inside blocks (if, function, loops) is a **Syntax Error**.
* **Aliasing:** Not supported in v1. The module namespace is derived strictly from the filename.
  * `"string"` -> `string`
  * `"./utils/math"` -> `math`
  * `"my-config"` -> `my_config` (Sanitized: kebab-case -> snake_case)

### 2.2. Export Declaration

All symbols are **private by default**. The `export` keyword exposes them to importers.

```pumpkin
export let MAX_RETRIES = 5
export function connect() { ... }
```

## 3. Semantics & Execution Model

### 3.1. Resolution Algorithm

When `import "X"` is encountered:

1. **Stdlib Check:** Is `X` a built-in module? (e.g., `math`, `system`). If yes, resolve to Internal Module.
2. **File Check:**
    * If starts with `./` or `../`, resolve relative to current file's directory.
    * Append `.pumpkin` extension if missing.
3. **Error:** If file not found, raise **Compile Error**: `ModuleNotFoundError`.

### 3.2. Execution Order (The "Singleton" Rule)

1. **Parse Phase:** The runtime parses the entry file and recursively parses all imports to build a Dependency Graph.
2. **Cycle Check:** The graph is validated for cycles.
    * *Rationale:* Circular imports create ambiguity about initialization order. Pumpkin strictly forbids them.
    * **Error:** `CircularDependencyError: A -> B -> A`.
3. **Evaluation:**
    * Modules are executed in **Topological Order** (leaves first).
    * Each module is executed **exactly once**.
    * The resulting exports are cached. All subsequent imports of the same module receive the same cached `ModuleObject`.

### 3.3. Scope Isolation

Modules do **not** share global scope.

* **Exports** are the only bridge.
* **Globals** (stdlib objects like `Math`) are available in all modules.

## 4. Error Handling Taxonomy

| Scenario | Error Type | Message |
| :--- | :--- | :--- |
| File does not exist | `ModuleNotFoundError` | "Could not find module './foo'." |
| Cycle (A imports A) | `CircularDependencyError` | "Cycle detected: main -> A -> main." |
| Import inside function | `SyntaxError` | "Imports must be at the top level." |
| Accessing non-export | `PropertyError` | "Module 'math' has no exported member 'internal_calc'." |

## 5. Rationale & Edge Cases

* **Why no aliasing?** (`import "math" as m`)
  * *Decision:* Forces consistent naming across the codebase. `math` is always `math`.
* **Why no circular imports?**
  * *Decision:* Guarantees deterministic initialization order. Users must refactor shared logic into a third "common" module.
* **Why top-level only?**
  * *Decision:* Allows static analysis of dependencies before execution starts.

## 6. Examples

### Example A: Standard Library

Using built-in modules.

```pumpkin
# main.pumpkin
import "math"

let r = 10
show math.PI * r * r
```

### Example B: Local Application Logic

Separating configuration from logic.

```pumpkin
# config.pumpkin
export let PORT = 8080
export let DEBUG = true
```

```pumpkin
# server.pumpkin
import "./config"

function start() {
    if config.DEBUG {
        show "Starting in debug mode..."
    }
    show "Listening on " + config.PORT
}
start()
```

### Example C: Encapsulation

Hiding internal implementation details.

```pumpkin
# db.pumpkin
let _pool_size = 0 # Private variable

function _connect_internal() { # Private function
    _pool_size = _pool_size + 1
}

export function connect() {
    _connect_internal()
    show "Connected! Pool: " + _pool_size
}
```

```pumpkin
# main.pumpkin
import "./db"

db.connect()
# show db._pool_size  <-- ERROR: Private
```
