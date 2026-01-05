# Pumpkin Walkthrough: The First Program 🎃

This document demonstrates the complete lifecycle of a Pumpkin program, from source code to parsed AST to final execution.

## 1. The Source Code

**File**: `examples/first_program.pumpkin`

We write a simple program to calculate the factorial of 5 (5 *4* 3 *2* 1 = 120).

```python
let count = 5
let factorial = 1

show "Calculating Factorial..."

while count > 0 {
  show count
  factorial = factorial * count
  count = count - 1
}

if factorial > 100 {
  show "Big number! (Result > 100)"
} else {
  show "Small number"
}

show "Factorial Result:"
show factorial
```

## 2. The Abstract Syntax Tree (AST) 🌳

**Tool**: `tools/inspect_ast.ts`

The parser reads the source and transforms it into a strict JSON tree. Notice how `while count > 0` becomes a `WhileStmt` containing a `BinaryExpr`.

```json
{
  "kind": "Program",
  "body": [
    {
      "kind": "LetStmt",
      "name": { "kind": "Identifier", "name": "count" },
      "value": { "kind": "Literal", "value": 5 }
    },
    {
      "kind": "WhileStmt",
      "condition": {
        "kind": "BinaryExpr",
        "operator": ">",
        "left": { "kind": "Identifier", "name": "count" },
        "right": { "kind": "Literal", "value": 0 }
      },
      "body": {
        "kind": "Block",
        "body": [
          { "kind": "ShowStmt", "expression": { "kind": "Identifier", "name": "count" } },
          {
            "kind": "AssignStmt",
            "name": { "kind": "Identifier", "name": "factorial" },
            "value": {
              "kind": "BinaryExpr",
              "operator": "*",
              "left": { "kind": "Identifier", "name": "factorial" },
              "right": { "kind": "Identifier", "name": "count" }
            }
          }
        ]
      }
    }
  ]
}
```

## 3. Execution Flow 🚀

**Interpreter**: `src/interpreter.ts`

1. **Environment Setup**: A Global Environment is created. `count` (5) and `factorial` (1) are defined.
2. **Loop**: The `evaluate` function sees `WhileStmt`. It checks the condition `count > 0` (5 > 0 is true).
3. **Iteration**:
    * Prints `5`.
    * `factorial` becomes `1 * 5 = 5`.
    * `count` becomes `4`.
4. **Repeat**: This continues until `count` is `0`.
5. **Condition**: The `IfStmt` checks `factorial > 100` (120 > 100 is true).
6. **Branch**: Executes the "Big number" block.

## 4. Final Output

**Result**:

```text
Calculating Factorial...
5
4
3
2
1
Big number! (Result > 100)
Factorial Result:
120
```
