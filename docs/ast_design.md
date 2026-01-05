# Pumpkin AST Design (v0.1)

This document describes the canonical Abstract Syntax Tree (AST) structure for the Pumpkin programming language.

## Design Goals

1. **Explicitness**: Every node has a string `kind` field for easy discrimination (tagged union).
2. **Serializability**: The structure is purely data (JSON-compatible), making it easy to debug and serialize.
3. **Simplicity**: Flat hierarchy where numbers, strings, and booleans are all `Literal` nodes.

## Node Reference

See `src/ast/nodes.ts` for full TypeScript definitions.

## Examples

### 1. Variable Declaration

**Source:**

```pumpkin
let x = 10
```

**AST:**

```json
{
  "kind": "LetStmt",
  "name": {
    "kind": "Identifier",
    "name": "x"
  },
  "value": {
    "kind": "Literal",
    "value": 10,
    "raw": "10"
  }
}
```

### 2. Binary Expression

**Source:**

```pumpkin
a + 5
```

**AST:**

```json
{
  "kind": "BinaryExpr",
  "operator": "+",
  "left": {
    "kind": "Identifier",
    "name": "a"
  },
  "right": {
    "kind": "Literal",
    "value": 5,
    "raw": "5"
  }
}
```

### 3. If Statement

**Source:**

```pumpkin
if x > 0 {
    show "Positive"
}
```

**AST:**

```json
{
  "kind": "IfStmt",
  "condition": {
    "kind": "BinaryExpr",
    "operator": ">",
    "left": { "kind": "Identifier", "name": "x" },
    "right": { "kind": "Literal", "value": 0, "raw": "0" }
  },
  "thenBlock": {
    "kind": "Block",
    "body": [
      {
        "kind": "ShowStmt",
        "expression": {
          "kind": "Literal",
          "value": "Positive",
          "raw": "\"Positive\""
        }
      }
    ]
  }
}
```

## Rationale for Design Choices

* **`kind` Property**: We use `kind` instead of `type` to avoid confusion with type systems (e.g., number, string). It aligns with ESTree and TypeScript compiler ASTs.
* **Literals**: We preserve the `raw` value of literals. This is useful for pretty-printing or tools that need to know exactly how the user wrote the value (e.g., hex vs decimal).
* **Blocks**: `Block` is explicit. Even if a control flow structure only allows one statement conceptually, looping constructs in Pumpkin use braces `{ ... }`, so representing them as a `Block` node containing a list of statements is natural.
