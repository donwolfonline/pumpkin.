import { grammar } from '../ohm_grammar.js';
import * as AST from './nodes.js';
function getLoc(node) {
    const { source } = node;
    const start = source.startIdx;
    const end = source.endIdx;
    return { start, end, line: 0, col: 0 };
}
// Cast to any to bypass strict checks
const semantics = grammar.createSemantics();
semantics.addOperation('toAST', {
    Program(stmts) {
        return {
            kind: 'Program',
            body: stmts.children.map((c) => c.toAST()),
            loc: getLoc(this)
        };
    },
    LetDecl(_let, identifier, _eq, exp) {
        return {
            kind: 'LetStmt',
            name: identifier.toAST(),
            value: exp.toAST(),
            loc: getLoc(this)
        };
    },
    Reassignment(identifier, _eq, exp) {
        return {
            kind: 'AssignStmt',
            name: identifier.toAST(),
            value: exp.toAST(),
            loc: getLoc(this)
        };
    },
    ShowStmt(_show, exp) {
        return {
            kind: 'ShowStmt',
            expression: exp.toAST(),
            loc: getLoc(this)
        };
    },
    AskStmt(_ask, str, _into, identifier) {
        // Mapping Ask to an assignment of a call to 'ask'
        return {
            kind: 'AssignStmt',
            name: identifier.toAST(),
            value: {
                kind: 'CallExpr',
                callee: { kind: 'Identifier', name: 'ask' },
                arguments: [str.toAST()]
            },
            loc: getLoc(this)
        };
    },
    IfStmt(_if, cond, block, _else, elseBlock) {
        return {
            kind: 'IfStmt',
            condition: cond.toAST(),
            thenBlock: block.toAST(),
            elseBlock: elseBlock.numChildren > 0 ? elseBlock.children[0].toAST() : undefined,
            loc: getLoc(this)
        };
    },
    LoopStmt(_repeat, count, _times, block) {
        return {
            kind: 'RepeatStmt',
            count: count.toAST(),
            body: block.toAST(),
            loc: getLoc(this)
        };
    },
    WhileStmt(_while, cond, block) {
        return {
            kind: 'WhileStmt',
            condition: cond.toAST(),
            body: block.toAST(),
            loc: getLoc(this)
        };
    },
    FuncDecl(_func, identifier, _lp, params, _rp, block) {
        const paramList = params.numChildren > 0 ? params.children[0].toAST() : [];
        return {
            kind: 'FuncDecl',
            name: identifier.toAST(),
            params: paramList,
            body: block.toAST(),
            loc: getLoc(this)
        };
    },
    ReturnStmt(_return, exp) {
        return {
            kind: 'ReturnStmt',
            argument: exp.toAST(),
            loc: getLoc(this)
        };
    },
    CallStmt(callExp) {
        return {
            kind: 'ExprStmt',
            expression: callExp.toAST(),
            loc: getLoc(this)
        };
    },
    Block(_lb, stmts, _rb) {
        return {
            kind: 'Block',
            body: stmts.children.map((c) => c.toAST()),
            loc: getLoc(this)
        };
    },
    // Expressions
    LogicOr_or(left, _op, right) {
        return { kind: 'BinaryExpr', operator: 'or', left: left.toAST(), right: right.toAST(), loc: getLoc(this) };
    },
    LogicAnd_and(left, _op, right) {
        return { kind: 'BinaryExpr', operator: 'and', left: left.toAST(), right: right.toAST(), loc: getLoc(this) };
    },
    LogicNot_not(_op, arg) {
        return { kind: 'UnaryExpr', operator: '!', argument: arg.toAST(), loc: getLoc(this) };
    },
    Compare_le(l, op, r) { return { kind: 'BinaryExpr', operator: '<=', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_lt(l, op, r) { return { kind: 'BinaryExpr', operator: '<', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_ge(l, op, r) { return { kind: 'BinaryExpr', operator: '>=', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_gt(l, op, r) { return { kind: 'BinaryExpr', operator: '>', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_eq(l, op, r) { return { kind: 'BinaryExpr', operator: '==', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_neq(l, op, r) { return { kind: 'BinaryExpr', operator: '!=', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    AddExp_add(l, op, r) { return { kind: 'BinaryExpr', operator: '+', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    AddExp_sub(l, op, r) { return { kind: 'BinaryExpr', operator: '-', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    MulExp_mul(l, op, r) { return { kind: 'BinaryExpr', operator: '*', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    MulExp_div(l, op, r) { return { kind: 'BinaryExpr', operator: '/', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    MulExp_mod(l, op, r) { return { kind: 'BinaryExpr', operator: '%', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    ExpExp_power(l, op, r) { return { kind: 'BinaryExpr', operator: '^', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    // Primary
    // Note: Primary rules in grammar are recursive for array index/access.
    // They are: Primary_index, Primary_access, and Atom.
    Primary_index(primary, _lb, exp, _rb) {
        // Hack: Map Index to CallExpr([exp]) until AST supports strings/index better
        return {
            kind: 'CallExpr',
            callee: primary.toAST(),
            arguments: [exp.toAST()],
            loc: getLoc(this)
        };
    },
    Primary_access(primary, _dot, identifier) {
        // Hack: Map Property Access to CallExpr("prop")
        // Justification provided in design steps.
        return {
            kind: 'CallExpr',
            callee: primary.toAST(),
            arguments: [{ kind: 'Literal', value: identifier.sourceString, raw: `"${identifier.sourceString}"` }],
            loc: getLoc(this)
        };
    },
    CallExp(identifier, _lp, args, _rp) {
        const argList = args.numChildren > 0 ? args.children[0].toAST() : [];
        return {
            kind: 'CallExpr',
            callee: identifier.toAST(),
            arguments: argList,
            loc: getLoc(this)
        };
    },
    Atom_paren(_lp, exp, _rp) {
        return exp.toAST();
    },
    List(_lb, items, _rb) {
        return {
            kind: 'ArrayLiteral',
            elements: items.asIteration().toAST(),
            loc: getLoc(this)
        };
    },
    Object(_lb, props, _rb) {
        return {
            kind: 'ObjectLiteral',
            properties: props.asIteration().toAST(),
            loc: getLoc(this)
        };
    },
    Prop(key, _colon, value) {
        let keyNode;
        if (key.ctorName === 'identifier') {
            keyNode = key.toAST();
        }
        else {
            keyNode = key.toAST();
        }
        return {
            kind: 'Property',
            key: keyNode,
            value: value.toAST(),
            loc: getLoc(this)
        };
    },
    // Identifiers and Literals use specific or generic handling depending on grammar
    identifier(start, rest) {
        return {
            kind: 'Identifier',
            name: this.sourceString,
            loc: getLoc(this)
        };
    },
    number_float(a, _dot, b) {
        return {
            kind: 'Literal',
            value: parseFloat(this.sourceString),
            raw: this.sourceString,
            loc: getLoc(this)
        };
    },
    number_int(a) {
        return {
            kind: 'Literal',
            value: parseInt(this.sourceString),
            raw: this.sourceString,
            loc: getLoc(this)
        };
    },
    stringLiteral(_q1, text, _q2) {
        return {
            kind: 'Literal',
            value: text.sourceString,
            raw: this.sourceString,
            loc: getLoc(this)
        };
    },
    boolean(_) {
        return {
            kind: 'Literal',
            value: this.sourceString === 'true',
            raw: this.sourceString,
            loc: getLoc(this)
        };
    },
    NonemptyListOf(first, _sep, rest) {
        return [first.toAST(), ...rest.toAST()];
    },
    EmptyListOf() {
        return [];
    },
    _iter(...children) {
        return children.map(c => c.toAST());
    },
    _terminal() {
        return this.sourceString;
    }
});
export default semantics;
//# sourceMappingURL=semantics.js.map