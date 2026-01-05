
import * as AST from './ast/nodes.js';
import { Environment } from './environment.js';
import * as readlineSync from 'readline-sync';
import {
    PumpkinError,
    TypeMismatchError,
    FunctionNotFoundError,
    InvalidOperationError
} from './errors.js';

// Internal class for control flow (Return)
class ReturnValue {
    constructor(public value: any) { }
}

// --------------------------------------------------------------------------
// Evaluator
// --------------------------------------------------------------------------

export function evaluate(node: AST.BaseNode, env: Environment): any {
    switch (node.kind) {
        // --- Program ---
        case 'Program':
            return evalProgram(node as AST.Program, env);

        // --- Statements ---
        case 'LetStmt':
            return evalLetStmt(node as AST.LetStmt, env);
        case 'AssignStmt':
            return evalAssignStmt(node as AST.AssignStmt, env);
        case 'ShowStmt':
            return evalShowStmt(node as AST.ShowStmt, env);
        case 'IfStmt':
            return evalIfStmt(node as AST.IfStmt, env);
        case 'RepeatStmt':
            return evalRepeatStmt(node as AST.RepeatStmt, env);
        case 'WhileStmt':
            return evalWhileStmt(node as AST.WhileStmt, env);
        case 'FuncDecl':
            return evalFuncDecl(node as AST.FuncDecl, env);
        case 'ReturnStmt':
            return evalReturnStmt(node as AST.ReturnStmt, env);
        case 'ExprStmt':
            return evaluate((node as AST.ExprStmt).expression, env);
        case 'Block':
            return evalBlock(node as AST.Block, env);

        // --- Expressions ---
        case 'BinaryExpr':
            return evalBinaryExpr(node as AST.BinaryExpr, env);
        case 'UnaryExpr':
            return evalUnaryExpr(node as AST.UnaryExpr, env);
        case 'CallExpr':
            return evalCallExpr(node as AST.CallExpr, env);
        case 'Literal':
            return (node as AST.Literal).value;
        case 'Identifier':
            return evalIdentifier(node as AST.Identifier, env);
        case 'ArrayLiteral':
            return evalArrayLiteral(node as AST.ArrayLiteral, env);
        case 'ObjectLiteral':
            return evalObjectLiteral(node as AST.ObjectLiteral, env);
        case 'Property':
            throw new Error("Property node should be handled by ObjectLiteral");

        default:
            throw new Error(`Unknown node kind: ${node.kind}`);
    }
}

// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------

function evalProgram(program: AST.Program, env: Environment): any {
    let lastResult: any = null;
    for (const stmt of program.body) {
        lastResult = evaluate(stmt, env);
    }
    return lastResult;
}

function evalLetStmt(stmt: AST.LetStmt, env: Environment): void {
    const value = evaluate(stmt.value, env);
    env.define(stmt.name.name, value);
}

function evalAssignStmt(stmt: AST.AssignStmt, env: Environment): void {
    const value = evaluate(stmt.value, env);
    env.assign(stmt.name.name, value);
}

function evalShowStmt(stmt: AST.ShowStmt, env: Environment): void {
    const value = evaluate(stmt.expression, env);
    // TODO: Use a configurable output stream instead of console.log directly?
    // For now, console.log is fine for CLI.
    console.log(value);
}

function evalIfStmt(stmt: AST.IfStmt, env: Environment): any {
    const condition = evaluate(stmt.condition, env);
    if (condition) {
        return evaluate(stmt.thenBlock, env);
    } else if (stmt.elseBlock) {
        return evaluate(stmt.elseBlock, env);
    }
}

function evalRepeatStmt(stmt: AST.RepeatStmt, env: Environment): any {
    const count = evaluate(stmt.count, env);
    if (typeof count !== 'number') {
        throw new TypeMismatchError('number', typeof count);
    }

    let lastResult: any = null;
    for (let i = 0; i < count; i++) {
        lastResult = evaluate(stmt.body, env);
        if (lastResult instanceof ReturnValue) return lastResult;
    }
    return lastResult;
}

function evalWhileStmt(stmt: AST.WhileStmt, env: Environment): any {
    let lastResult: any = null;
    while (evaluate(stmt.condition, env)) {
        lastResult = evaluate(stmt.body, env);
        if (lastResult instanceof ReturnValue) return lastResult;
    }
    return lastResult;
}

function evalFuncDecl(stmt: AST.FuncDecl, env: Environment): void {
    const funcName = stmt.name.name;
    const paramNames = stmt.params.map(p => p.name);

    env.define(funcName, {
        type: 'function',
        name: funcName,
        params: paramNames,
        body: stmt.body, // Store AST Block
        closure: env // Capture definition scope
    });
}

function evalReturnStmt(stmt: AST.ReturnStmt, env: Environment): never {
    let value = null;
    if (stmt.argument) {
        value = evaluate(stmt.argument, env);
    }
    throw new ReturnValue(value);
}

function evalBlock(block: AST.Block, env: Environment): any {
    // strict: new environment for block
    const blockEnv = new Environment(new Map(), env);
    let lastResult: any = null;

    try {
        for (const stmt of block.body) {
            lastResult = evaluate(stmt, blockEnv);
        }
    } catch (e) {
        // Propagate ReturnValue up
        throw e;
    }

    return lastResult;
}

function evalBinaryExpr(expr: AST.BinaryExpr, env: Environment): any {
    const left = evaluate(expr.left, env);
    const right = evaluate(expr.right, env);

    switch (expr.operator) {
        case '+':
            if (typeof left === 'string' || typeof right === 'string') {
                return String(left) + String(right);
            }
            return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '%': return left % right;
        case '^': return Math.pow(left, right);
        case '==': return left === right;
        case '!=': return left !== right;
        case '<': return left < right;
        case '<=': return left <= right;
        case '>': return left > right;
        case '>=': return left >= right;
        case 'or': return left || right;
        case 'and': return left && right;
        default:
            throw new InvalidOperationError(expr.operator, "Unknown operator");
    }
}

function evalUnaryExpr(expr: AST.UnaryExpr, env: Environment): any {
    const val = evaluate(expr.argument, env);
    if (expr.operator === '!') return !val;
    if (expr.operator === '-') return -val;
    throw new InvalidOperationError(expr.operator, "Unknown unary operator");
}

function evalCallExpr(expr: AST.CallExpr, env: Environment): any {
    // Special handling for 'ask' if it was mapped to a CallExpr
    // In our semantics.ts, we mapped AskStmt to a CallExpr to 'ask' inside an AssignStmt?
    // Wait, semantics.ts Logic: 
    // AskStmt -> AssignStmt(name, CallExpr('ask', [str]))
    // So if the function name is 'ask', we can interception it here OR define it in stdlib.
    // Let's intercept 'ask' here for now as it uses readlineSync (I/O).

    // Evaluate callee. AST says callee is Expression.
    // Usually Identifier('print') -> resolves to function object.

    // Check if callee is identifier 'ask'
    if (expr.callee.kind === 'Identifier' && (expr.callee as AST.Identifier).name === 'ask') {
        // Native ASK implementation
        if (expr.arguments.length !== 1) {
            throw new Error("ask() requires exactly 1 argument (the prompt)");
        }
        const prompt = evaluate(expr.arguments[0]!, env);
        const answer = readlineSync.question(prompt + ' ');
        const num = parseFloat(answer);
        return isNaN(num) ? answer : num;
    }

    // Normal Function Call
    let func: any;

    // Handle Member Expression hack (CallExpr calling AST.CallExpr?)
    // In semantics.ts we mapped `Primary[Exp]` to `CallExpr(Primary, [Exp])` effectively?
    // No, we mapped it to CallExpr where callee is Primary.
    // If callee evaluates to an ARRAY, and args length is 1, treat as index access.
    // If callee evaluates to an OBJECT, and args length is 1 (string), treat as prop access.

    const calleeVal = evaluate(expr.callee, env);

    // 1. Array Indexing / Object Access handling (due to AST v0.1 hack)
    if ((Array.isArray(calleeVal) || (typeof calleeVal === 'object' && calleeVal !== null && !calleeVal.type))) {
        // It's a data object/array, not a function definition
        if (expr.arguments.length === 1) {
            const idx = evaluate(expr.arguments[0]!, env);
            return calleeVal[idx];
        }
    }

    func = calleeVal;

    if (!func || func.type !== 'function') {
        // Could be trying to call a non-function
        // e.g. 10(20)
        // Or our hack failed.
        // Let's try to get a name if possible
        const name = (expr.callee.kind === 'Identifier') ? (expr.callee as AST.Identifier).name : '<anonymous>';
        throw new FunctionNotFoundError(name);
    }

    const args = expr.arguments.map(arg => evaluate(arg, env));

    // Create scope
    const funcEnv = new Environment(new Map(), func.closure);

    // Bind
    func.params.forEach((name: string, i: number) => {
        funcEnv.define(name, args[i]);
    });

    // Exec
    let result: any = null;
    try {
        result = evaluate(func.body, funcEnv);
    } catch (e) {
        if (e instanceof ReturnValue) return e.value;
        throw e;
    }

    return result;
}

function evalIdentifier(node: AST.Identifier, env: Environment): any {
    return env.get(node.name);
}

function evalArrayLiteral(node: AST.ArrayLiteral, env: Environment): any {
    return node.elements.map(e => evaluate(e, env));
}

function evalObjectLiteral(node: AST.ObjectLiteral, env: Environment): any {
    const obj: any = {};
    for (const prop of node.properties) {
        const key = (prop.key.kind === 'Identifier')
            ? (prop.key as AST.Identifier).name
            : (prop.key as AST.Literal).value as string;

        obj[key] = evaluate(prop.value, env);
    }
    return obj;
}


// --------------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------------

// Re-export Environment for convenience
export { Environment };


import { installStdlib } from './stdlib/index.js';

// Global Environment Helper
export const globalEnv = new Environment();
installStdlib(globalEnv);

// Reset for tests/REPL
export function resetGlobalEnv() {
    globalEnv.vars.clear();
    installStdlib(globalEnv);
}
