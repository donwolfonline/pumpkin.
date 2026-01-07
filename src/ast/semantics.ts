import { grammar } from '../ohm_grammar.js';
import * as AST from './nodes.js';

function getLoc(node: any): AST.SourceLocation {
    const { source } = node;
    const start = source.startIdx;
    const end = source.endIdx;
    return { start, end, line: 0, col: 0 };
}

// Cast to any to bypass strict checks
const semantics: any = grammar.createSemantics();

semantics.addOperation('toAST', {
    Program(stmts: any) {
        return {
            kind: 'Program',
            body: stmts.children.map((c: any) => c.toAST()),
            loc: getLoc(this)
        };
    },

    LetDecl(_let: any, identifier: any, _colon: any, _type: any, _eq: any, exp: any) {
        return {
            kind: 'LetStmt',
            name: identifier.toAST(),
            value: exp.toAST(),
            loc: getLoc(this)
        };
    },

    Reassignment(identifier: any, _eq: any, exp: any) {
        return {
            kind: 'AssignStmt',
            target: identifier.toAST(),
            value: exp.toAST(),
            loc: getLoc(this)
        };
    },

    ShowStmt(_show: any, exp: any) {
        return {
            kind: 'ShowStmt',
            expression: exp.toAST(),
            loc: getLoc(this)
        };
    },

    AskStmt(_ask: any, str: any, _into: any, identifier: any) {
        // Mapping Ask to an assignment of a call to 'ask'
        return {
            kind: 'AssignStmt',
            target: identifier.toAST(),
            value: {
                kind: 'CallExpr',
                callee: { kind: 'Identifier', name: 'ask' } as AST.Identifier,
                arguments: [str.toAST()]
            } as AST.CallExpr,
            loc: getLoc(this)
        };
    },

    IfStmt(_if: any, cond: any, block: any, _else: any, elseBlock: any) {
        return {
            kind: 'IfStmt',
            condition: cond.toAST(),
            thenBlock: block.toAST(),
            elseBlock: elseBlock.numChildren > 0 ? elseBlock.children[0].toAST() : undefined,
            loc: getLoc(this)
        };
    },

    LoopStmt(_repeat: any, count: any, _times: any, block: any) {
        return {
            kind: 'RepeatStmt',
            count: count.toAST(),
            body: block.toAST(),
            loc: getLoc(this)
        };
    },

    WhileStmt(_while: any, cond: any, block: any) {
        return {
            kind: 'WhileStmt',
            condition: cond.toAST(),
            body: block.toAST(),
            loc: getLoc(this)
        };
    },

    FuncDecl(_func: any, identifier: any, _lp: any, params: any, _rp: any, _colon: any, _type: any, block: any) {
        const paramList = params.numChildren > 0 ? params.children[0].toAST() : [];
        return {
            kind: 'FuncDecl',
            name: identifier.toAST(),
            params: paramList,
            body: block.toAST(),
            loc: getLoc(this)
        };
    },

    ReturnStmt(_return: any, exp: any) {
        return {
            kind: 'ReturnStmt',
            argument: exp.toAST(),
            loc: getLoc(this)
        };
    },

    CallStmt(callExp: any) {
        return {
            kind: 'ExprStmt',
            expression: callExp.toAST(),
            loc: getLoc(this)
        };
    },

    Block(_lb: any, stmts: any, _rb: any) {
        return {
            kind: 'Block',
            body: stmts.children.map((c: any) => c.toAST()),
            loc: getLoc(this)
        };
    },

    // Expressions

    LogicOr_or(left: any, _op: any, right: any) {
        return { kind: 'BinaryExpr', operator: 'or', left: left.toAST(), right: right.toAST(), loc: getLoc(this) };
    },

    LogicAnd_and(left: any, _op: any, right: any) {
        return { kind: 'BinaryExpr', operator: 'and', left: left.toAST(), right: right.toAST(), loc: getLoc(this) };
    },

    LogicNot_not(_op: any, arg: any) {
        return { kind: 'UnaryExpr', operator: '!', argument: arg.toAST(), loc: getLoc(this) };
    },

    Compare_le(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '<=', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_lt(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '<', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_ge(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '>=', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_gt(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '>', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_eq(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '==', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    Compare_neq(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '!=', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },

    AddExp_add(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '+', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    AddExp_sub(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '-', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },

    MulExp_mul(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '*', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    MulExp_div(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '/', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },
    MulExp_mod(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '%', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },

    ExpExp_power(l: any, op: any, r: any) { return { kind: 'BinaryExpr', operator: '^', left: l.toAST(), right: r.toAST(), loc: getLoc(this) }; },

    // Primary

    // Note: Primary rules in grammar are recursive for array index/access.
    // They are: Primary_index, Primary_access, and Atom.

    Primary_index(primary: any, _lb: any, exp: any, _rb: any) {
        // Hack: Map Index to CallExpr([exp]) until AST supports strings/index better
        return {
            kind: 'CallExpr',
            callee: primary.toAST(),
            arguments: [exp.toAST()],
            loc: getLoc(this)
        };
    },

    Primary_access(primary: any, _dot: any, identifier: any) {
        // Hack: Map Property Access to CallExpr("prop")
        // Justification provided in design steps.
        return {
            kind: 'CallExpr',
            callee: primary.toAST(),
            arguments: [{ kind: 'Literal', value: identifier.sourceString, raw: `"${identifier.sourceString}"` }],
            loc: getLoc(this)
        };
    },

    CallExp(identifier: any, _lp: any, args: any, _rp: any) {
        const argList = args.numChildren > 0 ? args.children[0].toAST() : [];
        return {
            kind: 'CallExpr',
            callee: identifier.toAST(),
            arguments: argList,
            loc: getLoc(this)
        };
    },

    Atom_paren(_lp: any, exp: any, _rp: any) {
        return exp.toAST();
    },

    List(_lb: any, items: any, _rb: any) {
        return {
            kind: 'ArrayLiteral',
            elements: items.asIteration().toAST(),
            loc: getLoc(this)
        };
    },

    Object(_lb: any, props: any, _rb: any) {
        return {
            kind: 'ObjectLiteral',
            properties: props.asIteration().toAST(),
            loc: getLoc(this)
        };
    },

    Prop(key: any, _colon: any, value: any) {
        let keyNode;
        if (key.ctorName === 'identifier') {
            keyNode = key.toAST();
        } else {
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

    identifier(start: any, rest: any) {
        return {
            kind: 'Identifier',
            name: this.sourceString,
            loc: getLoc(this)
        };
    },

    number_float(a: any, _dot: any, b: any) {
        return {
            kind: 'Literal',
            value: parseFloat(this.sourceString),
            raw: this.sourceString,
            loc: getLoc(this)
        };
    },

    number_int(a: any) {
        return {
            kind: 'Literal',
            value: parseInt(this.sourceString),
            raw: this.sourceString,
            loc: getLoc(this)
        };
    },

    stringLiteral(_q1: any, text: any, _q2: any) {
        return {
            kind: 'Literal',
            value: text.sourceString,
            raw: this.sourceString,
            loc: getLoc(this)
        };
    },

    boolean(_: any) {
        return {
            kind: 'Literal',
            value: this.sourceString === 'true',
            raw: this.sourceString,
            loc: getLoc(this)
        };
    },

    NonemptyListOf(first: any, _sep: any, rest: any) {
        return [first.toAST(), ...rest.toAST()];
    },

    EmptyListOf() {
        return [];
    },

    _iter(...children: any[]) {
        return children.map(c => c.toAST());
    },

    _terminal() {
        return this.sourceString;
    }
});

export default semantics;
