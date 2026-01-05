# Interpreter Pitfalls & Solutions 🚧

This guide safeguards Pumpkin core contributors against common mistakes when implementing or extending the interpreter.

## The Pitfall Matrix

| Pitfall | Consequence | Pumpkin Solution |
| :--- | :--- | :--- |
| **Environment Leakage** | Variables declared in a `while` loop or `if` block accidentally persist after the block ends. | **Fresh Environments per Block.** Every `{ }` block creates a new `Environment` linked to its parent. |
| **Scope Confusion** | A function uses the variables active where it is *called* instead of where it was *defined* (Dynamic vs Lexical scoping). | **Closure Capture.** Functions store the `Environment` present at *definition time* and restore it during execution. |
| **Expression/Statement Mixup** | Trying to assign a value to a statement (e.g., `let x = if ...`) or expecting a return value from a `LetDecl`. | **Strict Grammar separation.** `Statement` (void/effect) and `Expression` (value) are disjoint types in AST and Grammar. |
| **Error Explosion** | One typo crashes the entire runtime, printing a raw Java/JS stack trace to the user. | **Boundary Wrapping.** The CLI and REPL wrap execution in a `try/catch` block that only surfaces `PumpkinError` instances. |
| **Mutable AST Bugs** | Modifying AST nodes during execution (e.g., resolving variable names in place) causes side-effects on subsequent runs. | **Read-Only AST.** The AST is treated as immutable data. Execution state lives solely in the `Environment`. |
| **REPL State Corruption** | A syntax error in the REPL marks variables as "defined" but with bad values, or leaves open handles. | **Atomic Evaluation.** In the REPL, a line is parsed fully before any execution begins. Errors abort the step before touching the Env. |

## Code Patterns to Follow ✅

### 1. Handling Blocks

Always create a new scope when entering a block.

```typescript
// ✅ Good:
case 'Block':
    const blockEnv = new Environment(currentEnv); // New scope
    executeBlock(node.body, blockEnv);
```

### 2. Resolving Variables

Always lookup through the environment chain.

```typescript
// ✅ Good:
const value = env.get(varName); // Throws if not found in chain
```

### 3. Error Throwing

Always use specific `PumpkinError` types.

```typescript
// ✅ Good:
if (b === 0) throw new RuntimeError("Division by zero");
```

## Anti-Patterns to Ban 🚫

### 1. Global State

Never use global variables in `interpreter.ts` to track state.

```typescript
// 🚫 Bad:
let currentLoopCount = 0; // Will break in nested calls or REPL
```

### 2. Modifying Nodes

Never attach runtime data to the AST node itself.

```typescript
// 🚫 Bad:
node.runtimeValue = 5; // Pollutes the AST for the next run
```

### 3. Raw Errors

Never let a raw JS error escape.

```typescript
// 🚫 Bad:
JSON.parse(badInput); // Throws SyntaxError, crashing the CLI
```
