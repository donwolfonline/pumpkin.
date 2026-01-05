
// Pumpkin AST Nodes - v0.1

// --------------------
// Base Types
// --------------------

export interface SourceLocation {
    start: number;
    end: number;
    line: number;
    col: number;
}

export interface BaseNode {
    kind: string;
    loc?: SourceLocation;
}

export type Statement =
    | LetStmt
    | AssignStmt
    | ShowStmt
    | IfStmt
    | RepeatStmt
    | WhileStmt
    | FuncDecl
    | ReturnStmt
    | ExprStmt;

export type Expression =
    | BinaryExpr
    | UnaryExpr
    | CallExpr
    | Literal
    | Identifier
    | ArrayLiteral
    | ObjectLiteral;

// --------------------
// Program
// --------------------

export interface Program extends BaseNode {
    kind: 'Program';
    body: Statement[];
}

// --------------------
// Statements
// --------------------

export interface LetStmt extends BaseNode {
    kind: 'LetStmt';
    name: Identifier;
    value: Expression;
}

export interface AssignStmt extends BaseNode {
    kind: 'AssignStmt';
    name: Identifier;
    value: Expression;
}

export interface ShowStmt extends BaseNode {
    kind: 'ShowStmt';
    expression: Expression;
}

export interface IfStmt extends BaseNode {
    kind: 'IfStmt';
    condition: Expression;
    thenBlock: Block;
    elseBlock?: Block;
}

export interface RepeatStmt extends BaseNode {
    kind: 'RepeatStmt';
    count: Expression;
    body: Block;
}

export interface WhileStmt extends BaseNode {
    kind: 'WhileStmt';
    condition: Expression;
    body: Block;
}

export interface FuncDecl extends BaseNode {
    kind: 'FuncDecl';
    name: Identifier;
    params: Identifier[];
    body: Block;
}

export interface ReturnStmt extends BaseNode {
    kind: 'ReturnStmt';
    argument?: Expression;
}

export interface ExprStmt extends BaseNode {
    kind: 'ExprStmt';
    expression: Expression;
}

export interface Block extends BaseNode {
    kind: 'Block';
    body: Statement[];
}

// --------------------
// Expressions
// --------------------

export interface BinaryExpr extends BaseNode {
    kind: 'BinaryExpr';
    operator: '+' | '-' | '*' | '/' | '%' | '^' | '==' | '!=' | '<' | '<=' | '>' | '>=' | 'and' | 'or';
    left: Expression;
    right: Expression;
}

export interface UnaryExpr extends BaseNode {
    kind: 'UnaryExpr';
    operator: '!' | '-';
    argument: Expression;
}

export interface CallExpr extends BaseNode {
    kind: 'CallExpr';
    callee: Expression; // Usually Identifier, but could be Expr in future
    arguments: Expression[];
}

// --------------------
// Literals & Identifiers
// --------------------

export interface Literal extends BaseNode {
    kind: 'Literal';
    value: number | string | boolean | null;
    raw: string; // The original text representation
}

export interface Identifier extends BaseNode {
    kind: 'Identifier';
    name: string;
}

export interface ArrayLiteral extends BaseNode {
    kind: 'ArrayLiteral';
    elements: Expression[];
}

export interface ObjectLiteral extends BaseNode {
    kind: 'ObjectLiteral';
    properties: Property[];
}

export interface Property extends BaseNode {
    kind: 'Property';
    key: Identifier | Literal; // Key can be ident or string
    value: Expression;
}
