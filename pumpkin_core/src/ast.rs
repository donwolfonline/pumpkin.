
// pumpkin_core/src/ast.rs

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
    Block(Block),
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
    pub body: Vec<Statement>, // A Block is a list of Statements (including potentially nested Blocks)
    pub loc: Option<SourceLocation>,
}

// --- Expressions ---

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct BinaryExpr {
    pub operator: String,
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
    pub value: serde_json::Value,
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
    pub key: PropertyKey,
    pub value: Expression,
    pub loc: Option<SourceLocation>,
}

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(untagged)]
pub enum PropertyKey {
    Identifier(Identifier),
    Literal(Literal),
}
