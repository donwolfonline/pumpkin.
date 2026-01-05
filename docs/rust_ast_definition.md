# Canonical Rust AST Definition 🦀

**Goal:** Create deserialization targets that match `src/ast/nodes.ts` exactly.

These structs will act as the "Instruction Set" for the Rust Interpreter.

## `ast.rs`

```rust
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct SourceLocation {
    pub start: usize,
    pub end: usize,
    pub line: usize,
    pub col: usize,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Program {
    pub kind: String, // Always "Program"
    pub body: Vec<Statement>,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "kind")]
pub enum Statement {
    LetStmt(LetStmt),
    AssignStmt(AssignStmt),
    ShowStmt(ShowStmt),
    IfStmt(IfStmt),
    RepeatStmt(RepeatStmt),
    WhileStmt(WhileStmt),
    FuncDecl(FuncDecl),
    ReturnStmt(ReturnStmt),
    ExprStmt(ExprStmt),
    Block(Block), // Block can be a statement
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(tag = "kind")]
pub enum Expression {
    BinaryExpr(BinaryExpr),
    UnaryExpr(UnaryExpr),
    CallExpr(CallExpr),
    Literal(Literal),
    Identifier(Identifier),
    ArrayLiteral(ArrayLiteral),
    ObjectLiteral(ObjectLiteral),
}

// --- Statements ---

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct LetStmt {
    pub name: Identifier,
    pub value: Expression,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct AssignStmt {
    pub name: Identifier,
    pub value: Expression,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ShowStmt {
    pub expression: Expression,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct IfStmt {
    pub condition: Expression,
    #[serde(rename = "thenBlock")]
    pub then_block: Block,
    #[serde(rename = "elseBlock")]
    pub else_block: Option<Block>,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct RepeatStmt {
    pub count: Expression,
    pub body: Block,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct WhileStmt {
    pub condition: Expression,
    pub body: Block,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct FuncDecl {
    pub name: Identifier,
    pub params: Vec<Identifier>,
    pub body: Block,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ReturnStmt {
    pub argument: Option<Expression>,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ExprStmt {
    pub expression: Expression,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Block {
    pub body: Vec<Statement>,
    pub loc: Option<SourceLocation>,
}

// --- Expressions ---

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BinaryExpr {
    pub operator: String, // Enums can be overkill for operators if string is stable
    pub left: Box<Expression>,
    pub right: Box<Expression>,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct UnaryExpr {
    pub operator: String,
    pub argument: Box<Expression>,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct CallExpr {
    pub callee: Box<Expression>,
    pub arguments: Vec<Expression>,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Identifier {
    pub name: String,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Literal {
    pub value: serde_json::Value, // Can be Number, String, Bool, Null
    pub raw: String,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ArrayLiteral {
    pub elements: Vec<Expression>,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct ObjectLiteral {
    pub properties: Vec<Property>,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Property {
    pub key: PropertyKey, // Helper enum
    pub value: Expression,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum PropertyKey {
    Identifier(Identifier),
    Literal(Literal),
}
```

## Mapping Notes

1. **Tagging:** We use `#[serde(tag = "kind")]` for enums (`Statement`, `Expression`) because the TS AST uses a `kind` string property discriminator.
2. **Boxing:** Rust requires recursive types to be boxed (`Box<Expression>`).
3. **Renaming:** `thenBlock` -> `then_block` (snake_case in Rust, camelCase in JSON).
4. **Property Key:** In TS, `key` is `Identifier | Literal`. In Rust, we use an untagged enum `PropertyKey` to handle this polymorphism.
