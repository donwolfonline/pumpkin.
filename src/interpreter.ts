
import { grammar } from './parser.js';
import * as readlineSync from 'readline-sync';

// Environment to store variables
class Environment {
    constructor(public vars: Map<string, any> = new Map(), public parent: Environment | null = null) { }

    get(name: string): any {
        if (this.vars.has(name)) {
            return this.vars.get(name);
        }
        if (this.parent) {
            return this.parent.get(name);
        }
        throw new Error(`Undefined variable: ${name}`);
    }

    set(name: string, value: any) {
        if (this.vars.has(name)) {
            this.vars.set(name, value);
            return;
        }
        if (this.parent && this.parent.has(name)) {
            this.parent.set(name, value);
            return;
        }
        // New variable (or implicit global if not found? Let's strictly require 'let' for new vars in current scope, 
        // but the prompt implies 'let' for declaration. Reassignment implies existing.)
        // For 'Let', we use define(). For 'Reassignment', we use set().
        throw new Error(`Variable ${name} not declared. Use 'let' to declare it.`);
    }

    define(name: string, value: any) {
        this.vars.set(name, value);
    }

    has(name: string): boolean {
        if (this.vars.has(name)) return true;
        if (this.parent) return this.parent.has(name);
        return false;
    }
}

// Global environment
const globalEnv = new Environment();

// Semantics
const semantics = grammar.createSemantics();

semantics.addOperation('exec', {
    Program(stmts) {
        let lastResult;
        for (const stmt of stmts.children) {
            lastResult = stmt.exec();
        }
        return lastResult;
    },
    Statement(child) {
        return child.exec();
    },
    LetDecl(_let, identifier, _eq, exp) {
        const name = identifier.sourceString;
        const value = exp.eval();
        // Assuming 'let' declares in current scope
        // We need a way to pass the current environment. 
        // Ohm operations don't implicitly pass context efficiently without a global or extra args.
        // For simplicity in this REPL, we'll use a module-level 'currentEnv' or pass it.
        // Given the structure, let's use a module-level 'currentEnv' that we switch for functions.
        currentEnv.define(name, value);
    },
    Reassignment(identifier, _eq, exp) {
        const name = identifier.sourceString;
        const value = exp.eval();
        currentEnv.set(name, value);
    },
    ShowStmt(_show, exp) {
        const val = exp.eval();
        console.log(val);
        // return val; // Don't return value to avoid double printing in REPL
    },
    AskStmt(_ask, str, _into, identifier) {
        const prompt = str.eval(); // stringLiteral evaluates to string
        const answer = readlineSync.question(prompt + ' ');
        // Try to parse number if possible, else string
        const num = parseFloat(answer);
        currentEnv.define(identifier.sourceString, isNaN(num) ? answer : num);
    },
    IfStmt(_if, exp, block, _else, elseBlock) {
        const cond = exp.eval();
        if (cond) {
            return block.exec();
        } else {
            if (elseBlock.numChildren > 0) {
                return elseBlock.children[0]!.exec();
            }
        }
    },
    LoopStmt(_repeat, exp, _times, block) {
        const count = exp.eval();
        let last;
        for (let i = 0; i < count; i++) {
            last = block.exec();
        }
        return last;
    },
    WhileStmt(_while, exp, block) {
        let last;
        while (exp.eval()) {
            last = block.exec();
        }
        return last;
    },
    FuncDecl(_func, identifier, _lp, params, _rp, block) {
        const name = identifier.sourceString;
        const paramNames = params.numChildren > 0 ? params.children[0]!.asIteration().children.map(c => c.sourceString) : [];

        currentEnv.define(name, {
            type: 'function',
            params: paramNames,
            body: block,
            closure: currentEnv // Static scoping
        });
    },
    CallStmt(callExp) {
        return callExp.eval(); // CallExp is an expression, but here used as statement
    },
    Block(_lb, stmts, _rb) {
        // Blocks could allow local scope for 'let'? 
        // Prompt says "Variable declarations using let". 
        // Usually blocks have scopes. Let's create a new scope.
        const prevEnv = currentEnv;
        currentEnv = new Environment(new Map(), prevEnv);
        let last;
        for (const stmt of stmts.children) {
            last = stmt.exec();
        }
        currentEnv = prevEnv;
        return last;
    }
});

semantics.addOperation('eval', {
    Exp(child) {
        return child.eval();
    },
    LogicOr_or(left, _op, right) {
        return left.eval() || right.eval();
    },
    LogicAnd_and(left, _op, right) {
        return left.eval() && right.eval();
    },
    LogicNot_not(_op, child) {
        return !child.eval();
    },
    Compare_le(l, _op, r) { return l.eval() <= r.eval(); },
    Compare_lt(l, _op, r) { return l.eval() < r.eval(); },
    Compare_ge(l, _op, r) { return l.eval() >= r.eval(); },
    Compare_gt(l, _op, r) { return l.eval() > r.eval(); },
    Compare_eq(l, _op, r) { return l.eval() === r.eval(); },
    Compare_neq(l, _op, r) { return l.eval() !== r.eval(); },

    AddExp_add(l, _op, r) { return l.eval() + r.eval(); },
    AddExp_sub(l, _op, r) { return l.eval() - r.eval(); },

    MulExp_mul(l, _op, r) { return l.eval() * r.eval(); },
    MulExp_div(l, _op, r) { return l.eval() / r.eval(); },
    MulExp_mod(l, _op, r) { return l.eval() % r.eval(); },

    ExpExp_power(l, _op, r) { return Math.pow(l.eval(), r.eval()); },

    Primary_index(prim, _l, idx, _r) {
        const obj = prim.eval();
        const i = idx.eval();
        return obj[i];
    },
    Primary_access(prim, _dot, id) {
        const obj = prim.eval();
        return obj[id.sourceString];
    },
    Atom_paren(_l, exp, _r) {
        return exp.eval();
    },

    CallExp(identifier, _lp, args, _rp) {
        const funcName = identifier.sourceString;
        const func = currentEnv.get(funcName);

        if (func.type !== 'function') {
            throw new Error(`${funcName} is not a function`);
        }

        const argValues = args.numChildren > 0 ? args.children[0]!.asIteration().children.map(c => c.eval()) : [];

        // Switch env to function closure
        const prevEnv = currentEnv;
        const funcEnv = new Environment(new Map(), func.closure); // Closure scope

        // Bind args
        func.params.forEach((param: string, i: number) => {
            funcEnv.define(param, argValues[i]);
        });

        currentEnv = funcEnv;
        let result;
        try {
            // Function body execution
            // Note: Block.exec creates ANOTHER scope. That's fine.
            result = func.body.exec();
        } finally {
            currentEnv = prevEnv;
        }
        return result;
    },

    List(_lb, elems, _rb) {
        return elems.asIteration().children.map(c => c.eval());
    },
    Object(_lb, props, _rb) {
        const obj: any = {};
        props.asIteration().children.forEach(prop => {
            // Prop = (identifier | stringLiteral) ":" Exp
            // We need to access children of Prop
            // prop is a Node. prop.child(0) is key, prop.child(2) is value.
            // But we are in Object operation, accessing ListOf<Prop>.
            // We can delegate or manually drill.
            // Let's rely on Prop having an operation or drill down.
            // Since Prop is not an alternative of Exp, we can't call eval() on it directly unless we define it.
            // Let's drill. 
            const propNode = prop;
            const keyNode = propNode.child(0);
            let key = keyNode.sourceString;
            if (key.startsWith('"')) {
                key = key.slice(1, -1);
            }
            const val = propNode.child(2).eval();
            obj[key] = val;
        });
        return obj;
    },

    identifier(_1, _2) {
        return currentEnv.get(this.sourceString);
    },
    number(_) {
        return parseFloat(this.sourceString);
    },
    stringLiteral(_q1, text, _q2) {
        return text.sourceString;
    },
    boolean(_) {
        return this.sourceString === 'true';
    }
});

let currentEnv = globalEnv;

export function evaluate(match: any) {
    // Reset env if needed? No, REPL should persist.
    // But for 'evaluate', we just run.
    const adapter = semantics(match);
    return adapter.exec();
}

export function resetEnv() {
    currentEnv = new Environment(); // Clear specific vars
    // Or just clear globalEnv.vars
    globalEnv.vars.clear();
    currentEnv = globalEnv;
}
