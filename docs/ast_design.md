# Pumpkin AST Specification (v0.1 - Frozen)

> **Status:** Frozen / Authoritative
> **Version:** 0.1
> **Date:** 2026-01-05

This document defines the frozen Abstract Syntax Tree (AST) structure for Pumpkin v0.1. It serves as the contract between the Parser (Ohm.js) and the Runtime (Rust WASM).

## 1. Core Structure

The AST is a tree of **Nodes**. Every node has:

1. `type`: A string literal tag (discriminant).
2. `loc`: Source location (optional in v0.1, useful for error reporting).

### 1.1. Rust Enums

The structure simplifies into two primary enums: `Statement` and `Expression`.

```rust
// pumpkin_core/src/ast.rs

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Statement {
    LetStmt(LetStmt),
    AssignStmt(AssignStmt),
    ShowStmt(ShowStmt),
    IfStmt(IfStmt),
    RepeatStmt(RepeatStmt),
    WhileStmt(WhileStmt),
    ReturnStmt(ReturnStmt),
    FuncDecl(FuncDecl),
    Block(Block),
    ExprStmt(ExprStmt), // Expression used as statement (e.g. calls)
}

#[derive(Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum Expression {
    Literal(Literal),
    Identifier(Identifier),
    BinaryExpr(BinaryExpr),
    UnaryExpr(UnaryExpr),
    CallExpr(CallExpr),
    // Future Expansion:
    // ArrayLiteral(ArrayLiteral),
    // ObjectLiteral(ObjectLiteral),
}
```

---

## 2. Node Definitions

### 2.1. Program (Root)

```typescript
interface Program {
    type: "Program";
    body: Statement[];
}
```

### 2.2. Statements

#### `LetStmt`

Defines a new variable in the current scope.

```typescript
interface LetStmt {
    type: "LetStmt";
    name: Identifier;
    value: Expression;
}
```

#### `AssignStmt`

Reassigns an existing variable.

```typescript
interface AssignStmt {
    type: "AssignStmt";
    name: Identifier;
    value: Expression;
    // Future: operator (+=, -=)
}
```

#### `ShowStmt`

Prints to stdout.

```typescript
interface ShowStmt {
    type: "ShowStmt";
    expression: Expression;
}
```

#### `IfStmt`

Conditionals.

```typescript
interface IfStmt {
    type: "IfStmt";
    condition: Expression;
    then_block: Block;
    else_block?: Block | null;
}
```

#### `RepeatStmt`

Simple loop `N` times.

```typescript
interface RepeatStmt {
    type: "RepeatStmt";
    count: Expression; // Must evaluate to number
    body: Block;
}
```

#### `WhileStmt`

Conditional loop.

```typescript
interface WhileStmt {
    type: "WhileStmt";
    condition: Expression;
    body: Block;
}
```

#### `Block`

A sequence of statements in its own scope.

```typescript
interface Block {
    type: "Block";
    body: Statement[];
}
```

### 2.3. Expressions

#### `Literal`

Primitive values.

```typescript
interface Literal {
    type: "Literal";
    value: number | string | boolean | null;
    raw?: string; // Optional original text
}
```

#### `Identifier`

Variable references.

```typescript
interface Identifier {
    type: "Identifier";
    name: string;
}
```

#### `BinaryExpr`

Math and Logic.

```typescript
interface BinaryExpr {
    type: "BinaryExpr";
    operator: "+" | "-" | "*" | "/" | "%" | "==" | "!=" | "<" | ">" | "<=" | ">=" | "and" | "or";
    left: Expression;
    right: Expression;
}
```

#### `CallExpr`

Function invocation.

```typescript
interface CallExpr {
    type: "CallExpr";
    callee: Identifier; // Restricted to ID for v0.1
    arguments: Expression[];
}
```

---

## 3. Example JSON

**Source:**

```pumpkin
let x = 5
if x > 3 {
    show "Big"
}
```

**AST:**

```json
{
  "type": "Program",
  "body": [
    {
      "type": "LetStmt",
      "name": { "type": "Identifier", "name": "x" },
      "value": { "type": "Literal", "value": 5 }
    },
    {
      "type": "IfStmt",
      "condition": {
        "type": "BinaryExpr",
        "operator": ">",
        "left": { "type": "Identifier", "name": "x" },
        "right": { "type": "Literal", "value": 3 }
      },
      "then_block": {
        "type": "Block",
        "body": [
          {
            "type": "ShowStmt",
            "expression": { "type": "Literal", "value": "Big" }
          }
        ]
      }
    }
  ]
}
```
