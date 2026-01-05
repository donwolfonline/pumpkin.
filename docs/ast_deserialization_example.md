# AST Deserialization Example 🦀➡️📄

This example demonstrates how a Pumpkin source program is serialized to JSON (by the Ohm parser) and how it deserializes into the Rust `Program` struct.

## 1. Source Code (`test.pumpkin`)

```python
let x = 10
show x
```

## 2. JSON AST (Input to Rust)

```json
{
  "kind": "Program",
  "body": [
    {
      "kind": "LetStmt",
      "name": {
        "kind": "Identifier",
        "name": "x",
        "loc": { "start": 4, "end": 5, "line": 1, "col": 5 }
      },
      "value": {
        "kind": "Literal",
        "value": 10,
        "raw": "10",
        "loc": { "start": 8, "end": 10, "line": 1, "col": 9 }
      },
      "loc": { "start": 0, "end": 10, "line": 1, "col": 1 }
    },
    {
      "kind": "ShowStmt",
      "expression": {
        "kind": "Identifier",
        "name": "x",
        "loc": { "start": 16, "end": 17, "line": 2, "col": 6 }
      },
      "loc": { "start": 11, "end": 17, "line": 2, "col": 1 }
    }
  ],
  "loc": { "start": 0, "end": 17, "line": 1, "col": 1 }
}
```

## 3. Rust Struct (Deserialized)

```rust
Program {
    kind: "Program".to_string(),
    body: vec![
        Statement::LetStmt(LetStmt {
            name: Identifier { name: "x".to_string(), loc: Some(...) },
            value: Expression::Literal(Literal {
                value: serde_json::Value::Number(10), // parsed number
                raw: "10".to_string(),
                loc: Some(...)
            }),
            loc: Some(...)
        }),
        Statement::ShowStmt(ShowStmt {
            expression: Expression::Identifier(Identifier {
                name: "x".to_string(),
                loc: Some(...)
            }),
            loc: Some(...)
        })
    ],
    loc: Some(...)
}
```
