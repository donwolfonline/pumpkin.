import * as AST from './ast/nodes.js';
import { Environment } from './environment.js';
import * as readlineSync from 'readline-sync';
import { PumpkinError, TypeMismatchError, FunctionNotFoundError, InvalidOperationError } from './errors.js';
// Internal class for control flow (Return)
class ReturnValue {
    value;
    constructor(value) {
        this.value = value;
    }
}
// --------------------------------------------------------------------------
// Evaluator
// --------------------------------------------------------------------------
export function evaluate(node, env) {
    switch (node.kind) {
        // --- Program ---
        case 'Program':
            return evalProgram(node, env);
        // --- Statements ---
        case 'LetStmt':
            return evalLetStmt(node, env);
        case 'AssignStmt':
            return evalAssignStmt(node, env);
        case 'ShowStmt':
            return evalShowStmt(node, env);
        case 'IfStmt':
            return evalIfStmt(node, env);
        case 'RepeatStmt':
            return evalRepeatStmt(node, env);
        case 'WhileStmt':
            return evalWhileStmt(node, env);
        case 'FuncDecl':
            return evalFuncDecl(node, env);
        case 'ReturnStmt':
            return evalReturnStmt(node, env);
        case 'ExprStmt':
            return evaluate(node.expression, env);
        case 'Block':
            return evalBlock(node, env);
        // --- Expressions ---
        case 'BinaryExpr':
            return evalBinaryExpr(node, env);
        case 'UnaryExpr':
            return evalUnaryExpr(node, env);
        case 'CallExpr':
            return evalCallExpr(node, env);
        case 'Literal':
            return node.value;
        case 'Identifier':
            return evalIdentifier(node, env);
        case 'ArrayLiteral':
            return evalArrayLiteral(node, env);
        case 'ObjectLiteral':
            return evalObjectLiteral(node, env);
        case 'Property':
            throw new Error("Property node should be handled by ObjectLiteral");
        default:
            throw new Error(`Unknown node kind: ${node.kind}`);
    }
}
// --------------------------------------------------------------------------
// Helpers
// --------------------------------------------------------------------------
function evalProgram(program, env) {
    let lastResult = null;
    for (const stmt of program.body) {
        lastResult = evaluate(stmt, env);
    }
    return lastResult;
}
function evalLetStmt(stmt, env) {
    const value = evaluate(stmt.value, env);
    env.define(stmt.name.name, value);
}
function evalAssignStmt(stmt, env) {
    const value = evaluate(stmt.value, env);
    env.assign(stmt.name.name, value);
}
function evalShowStmt(stmt, env) {
    const value = evaluate(stmt.expression, env);
    // TODO: Use a configurable output stream instead of console.log directly?
    // For now, console.log is fine for CLI.
    console.log(value);
}
function evalIfStmt(stmt, env) {
    const condition = evaluate(stmt.condition, env);
    if (condition) {
        return evaluate(stmt.thenBlock, env);
    }
    else if (stmt.elseBlock) {
        return evaluate(stmt.elseBlock, env);
    }
}
function evalRepeatStmt(stmt, env) {
    const count = evaluate(stmt.count, env);
    if (typeof count !== 'number') {
        throw new TypeMismatchError('number', typeof count);
    }
    let lastResult = null;
    for (let i = 0; i < count; i++) {
        lastResult = evaluate(stmt.body, env);
        if (lastResult instanceof ReturnValue)
            return lastResult;
    }
    return lastResult;
}
function evalWhileStmt(stmt, env) {
    let lastResult = null;
    while (evaluate(stmt.condition, env)) {
        lastResult = evaluate(stmt.body, env);
        if (lastResult instanceof ReturnValue)
            return lastResult;
    }
    return lastResult;
}
function evalFuncDecl(stmt, env) {
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
function evalReturnStmt(stmt, env) {
    let value = null;
    if (stmt.argument) {
        value = evaluate(stmt.argument, env);
    }
    throw new ReturnValue(value);
}
function evalBlock(block, env) {
    // strict: new environment for block
    const blockEnv = new Environment(new Map(), env);
    let lastResult = null;
    try {
        for (const stmt of block.body) {
            lastResult = evaluate(stmt, blockEnv);
        }
    }
    catch (e) {
        // Propagate ReturnValue up
        throw e;
    }
    return lastResult;
}
function evalBinaryExpr(expr, env) {
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
function evalUnaryExpr(expr, env) {
    const val = evaluate(expr.argument, env);
    if (expr.operator === '!')
        return !val;
    if (expr.operator === '-')
        return -val;
    throw new InvalidOperationError(expr.operator, "Unknown unary operator");
}
function evalCallExpr(expr, env) {
    // Special handling for 'ask' if it was mapped to a CallExpr
    // In our semantics.ts, we mapped AskStmt to a CallExpr to 'ask' inside an AssignStmt?
    // Wait, semantics.ts Logic: 
    // AskStmt -> AssignStmt(name, CallExpr('ask', [str]))
    // So if the function name is 'ask', we can interception it here OR define it in stdlib.
    // Let's intercept 'ask' here for now as it uses readlineSync (I/O).
    // Evaluate callee. AST says callee is Expression.
    // Usually Identifier('print') -> resolves to function object.
    // Check if callee is identifier 'ask'
    if (expr.callee.kind === 'Identifier' && expr.callee.name === 'ask') {
        // Native ASK implementation
        if (expr.arguments.length !== 1) {
            throw new Error("ask() requires exactly 1 argument (the prompt)");
        }
        const prompt = evaluate(expr.arguments[0], env);
        const answer = readlineSync.question(prompt + ' ');
        const num = parseFloat(answer);
        return isNaN(num) ? answer : num;
    }
    // Normal Function Call
    let func;
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
            const idx = evaluate(expr.arguments[0], env);
            return calleeVal[idx];
        }
    }
    func = calleeVal;
    if (!func || func.type !== 'function') {
        // Could be trying to call a non-function
        // e.g. 10(20)
        // Or our hack failed.
        // Let's try to get a name if possible
        const name = (expr.callee.kind === 'Identifier') ? expr.callee.name : '<anonymous>';
        throw new FunctionNotFoundError(name);
    }
    const args = expr.arguments.map(arg => evaluate(arg, env));
    // Create scope
    const funcEnv = new Environment(new Map(), func.closure);
    // Bind
    func.params.forEach((name, i) => {
        funcEnv.define(name, args[i]);
    });
    // Exec
    let result = null;
    try {
        result = evaluate(func.body, funcEnv);
    }
    catch (e) {
        if (e instanceof ReturnValue)
            return e.value;
        throw e;
    }
    return result;
}
function evalIdentifier(node, env) {
    return env.get(node.name);
}
function evalArrayLiteral(node, env) {
    return node.elements.map(e => evaluate(e, env));
}
function evalObjectLiteral(node, env) {
    const obj = {};
    for (const prop of node.properties) {
        const key = (prop.key.kind === 'Identifier')
            ? prop.key.name
            : prop.key.value;
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
//# sourceMappingURL=interpreter.js.map