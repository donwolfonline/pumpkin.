
console.log("[Worker] Script evaluated.");

let ohm;
let initWasm;
let PumpkinVMClass;

let grammar;
let semantics;
let vm;
let useJSFallback = false;
let initError = null;

// Environment and JS Interpreter logic
class Environment {
    constructor(parent = null) {
        this.vars = new Map();
        this.parent = parent;
    }
    define(name, value) { this.vars.set(name, value); }
    assign(name, value) {
        if (this.vars.has(name)) { this.vars.set(name, value); return; }
        if (this.parent) { this.parent.assign(name, value); return; }
        throw new Error(`Variable not found: ${name}`);
    }
    get(name) {
        if (this.vars.has(name)) return this.vars.get(name);
        if (this.parent) return this.parent.get(name);
        throw new Error(`Variable not found: ${name}`);
    }
}

const capturedOutput = [];
const stdlibEnv = new Environment();
stdlibEnv.define("sqrt", { kind: "Native", fn: Math.sqrt });
stdlibEnv.define("random", { kind: "Native", fn: Math.random });

function evaluateJS(node, env) {
    if (!node) return null;
    switch (node.kind) {
        case 'Program':
            node.body.forEach(s => evaluateJS(s, env));
            return null;
        case 'LetStmt':
            env.define(node.name.name, evaluateJS(node.value, env));
            return null;
        case 'AssignStmt':
            if (node.target.kind === 'Identifier') {
                env.assign(node.target.name, evaluateJS(node.value, env));
            } else if (node.target.kind === 'IndexExpr') {
                const arr = evaluateJS(node.target.object, env);
                const idx = evaluateJS(node.target.index, env);
                arr[idx] = evaluateJS(node.value, env);
            }
            return null;
        case 'ShowStmt':
            capturedOutput.push(String(evaluateJS(node.expression, env)));
            return null;
        case 'IfStmt':
            if (evaluateJS(node.condition, env)) {
                evaluateJS(node.thenBlock, env);
            } else if (node.elseBlock) {
                evaluateJS(node.elseBlock, env);
            }
            return null;
        case 'RepeatStmt':
            const count = evaluateJS(node.count, env);
            for (let i = 0; i < count; i++) evaluateJS(node.body, env);
            return null;
        case 'WhileStmt':
            while (evaluateJS(node.condition, env)) evaluateJS(node.body, env);
            return null;
        case 'Block':
            const blockEnv = new Environment(env);
            node.body.forEach(s => evaluateJS(s, blockEnv));
            return null;
        case 'FuncDecl':
            env.define(node.name.name, {
                kind: 'Function',
                params: node.params.map(p => p.name),
                body: node.body,
                closure: env
            });
            return null;
        case 'ReturnStmt':
            throw { kind: 'Return', value: evaluateJS(node.argument, env) };
        case 'ExprStmt':
            evaluateJS(node.expression, env);
            return null;
        case 'BinaryExpr':
            const l = evaluateJS(node.left, env);
            const r = evaluateJS(node.right, env);
            switch (node.operator) {
                case '+': return l + r;
                case '-': return l - r;
                case '*': return l * r;
                case '/': return l / r;
                case '==': return l === r;
                case '!=': return l !== r;
                case '>': return l > r;
                case '<': return l < r;
                case '>=': return l >= r;
                case '<=': return l <= r;
                case 'or': return l || r;
                case 'and': return l && r;
                case '^': return Math.pow(l, r);
                default: return null;
            }
        case 'UnaryExpr':
            const v = evaluateJS(node.argument, env);
            return node.operator === 'not' ? !v : -v;
        case 'Identifier':
            return env.get(node.name);
        case 'Literal':
            return node.value;
        case 'CallExpr':
            const callee = evaluateJS(node.callee, env);
            const args = (node.arguments || []).map(a => evaluateJS(a, env));
            if (callee && callee.kind === 'Function') {
                const callEnv = new Environment(callee.closure);
                callee.params.forEach((p, i) => callEnv.define(p, args[i]));
                try {
                    evaluateJS(callee.body, callEnv);
                } catch (e) {
                    if (e.kind === 'Return') return e.value;
                    throw e;
                }
                return null;
            } else if (callee && callee.kind === 'Native') {
                return callee.fn(...args);
            }
            throw new Error(`Cannot call ${node.callee.name || 'expression'}`);
        case 'ArrayLiteral':
            return node.elements.map(e => evaluateJS(e, env));
        case 'ObjectLiteral':
            const obj = {};
            (node.properties || []).forEach(p => {
                const key = p.key.kind === 'Identifier' ? p.key.name : p.key.value;
                obj[key] = evaluateJS(p.value, env);
            });
            return obj;
        case 'IndexExpr':
            return evaluateJS(node.object, env)[evaluateJS(node.index, env)];
        case 'MemberExpr':
            const target = evaluateJS(node.object, env);
            if (node.property.name === 'length' && Array.isArray(target)) return target.length;
            return target[node.property.name];
        default:
            return null;
    }
}

const grammarSource = `
Pumpkin {
  Program = Statement+

  Statement
    = LetDecl
    | Reassignment
    | ShowStmt
    | AskStmt
    | IfStmt
    | LoopStmt
    | WhileStmt
    | FuncDecl
    | ReturnStmt
    | CallStmt

  ReturnStmt = "return" Exp?
  LetDecl = "let" identifier (":" Type)? "=" Exp
  Reassignment = Primary "=" Exp
  ShowStmt = "show" Exp
  AskStmt = "ask" stringLiteral "into" identifier
  IfStmt = "if" Exp Block ("else" Block)?
  LoopStmt = "repeat" Exp "times" Block
  WhileStmt = "while" Exp Block
  FuncDecl = "function" identifier "(" ParamList? ")" (":" Type)? Block
  CallStmt = CallExp

  Block = "{" Statement* "}"
  ParamList = NonemptyListOf<Param, ",">
  Param = identifier (":" Type)?
  Type = "number" | "string" | "boolean" | "array"

  Exp = LogicOr

  LogicOr
    = LogicOr "or" LogicAnd  -- or
    | LogicAnd

  LogicAnd
    = LogicAnd "and" LogicNot -- and
    | LogicNot

  LogicNot
    = "not" Compare           -- not
    | Compare

  Compare
    = AddExp "<=" AddExp      -- le
    | AddExp "<"  AddExp      -- lt
    | AddExp ">=" AddExp      -- ge
    | AddExp ">"  AddExp      -- gt
    | AddExp "==" AddExp      -- eq
    | AddExp "!=" AddExp      -- neq
    | AddExp

  AddExp
    = AddExp "+" MulExp       -- add
    | AddExp "-" MulExp       -- sub
    | MulExp

  MulExp
    = MulExp "*" ExpExp       -- mul
    | MulExp "/" ExpExp       -- div
    | MulExp "%" ExpExp       -- mod
    | ExpExp

  ExpExp
    = Primary "^" ExpExp      -- power
    | Primary

  Primary
    = Primary "[" Exp "]"     -- index
    | Primary "." identifier  -- access
    | Atom

  Atom
    = "(" Exp ")"             -- paren
    | CallExp                 -- call
    | List                    -- list
    | Object                  -- obj
    | identifier              -- id
    | number                  -- num
    | stringLiteral           -- str
    | boolean                 -- bool

  CallExp = identifier "(" ArgList? ")"
  ArgList = ListOf<Exp, ",">
  List = "[" ListOf<Exp, ","> "]"
  Object = "{" ListOf<Prop, ","> "}"
  Prop = (identifier | stringLiteral) ":" Exp

  identifier = ~keyword letter (alnum | "_")*
  keyword = ("let" | "show" | "ask" | "into" | "if" | "else" | "repeat" | "times" | "while" | "function" | "return" | "true" | "false" | "and" | "or" | "not" | "number" | "string" | "boolean" | "array") ~alnum

  number = digit+ "." digit+  -- float
         | digit+             -- int

  stringLiteral = "\\"" (~"\\"" any)* "\\""
  boolean = "true" | "false"

  comment = "#" (~"\\n" any)*
  space += comment
}
`;

function registerSemantics() {
    console.log("[Worker] Registering semantics...");
    const list = (n) => {
        if (n.numChildren === 0) return [];
        const inner = n.child(0);
        if (inner.ruleName === 'EmptyListOf') return [];
        const first = inner.child(0).toAST();
        const rest = inner.child(2).asIteration().children.map(c => c.child(1).toAST());
        return [first, ...rest];
    };

    semantics.addOperation('toAST', {
        Program(s) { return { kind: "Program", body: s.toAST(), loc: null }; },
        Statement(s) { return s.toAST(); },
        // LetDecl arity 6: expected "let", identifier, "(", ":", "Type", ")?", "=", Exp
        // Wait, if (":" Type)? is being expanded, it might be ":" and Type and ?
        LetDecl(_l, id, _cl, _t, _e, v) {
            return { kind: "LetStmt", name: id.toAST(), value: v.toAST(), loc: null };
        },
        Reassignment(t, _e, v) { return { kind: "AssignStmt", target: t.toAST(), value: v.toAST(), loc: null }; },
        ShowStmt(_s, e) { return { kind: "ShowStmt", expression: e.toAST(), loc: null }; },
        // IfStmt arity 5: "if", Exp, Block, "(", "else", "Block", ")?"
        IfStmt(_i, c, t, _el, eOpt) {
            // eOpt is likely the "else Block" group
            const e = eOpt.numChildren > 0 ? eOpt.child(1).toAST() : null;
            return { kind: "IfStmt", condition: c.toAST(), thenBlock: t.toAST(), elseBlock: e, loc: null };
        },
        LoopStmt(_r, n, _t, b) { return { kind: "RepeatStmt", count: n.toAST(), body: b.toAST(), loc: null }; },
        WhileStmt(_w, c, b) { return { kind: "WhileStmt", condition: c.toAST(), body: b.toAST(), loc: null }; },
        // FuncDecl arity 8: "function", identifier, "(", ParamList?, ")", ":", Type, "?", Block
        FuncDecl(_f, id, _p1, p, _p2, _cl, _t, b) {
            return { kind: "FuncDecl", name: id.toAST(), params: list(p), body: b.toAST(), loc: null };
        },
        ReturnStmt(_r, v) { return { kind: "ReturnStmt", argument: v.child(0) ? v.child(0).toAST() : null, loc: null }; },
        Block(_o, s, _c) { return { kind: "Block", body: s.toAST(), loc: null }; },
        LogicOr_or(l, _o, r) { return { kind: "BinaryExpr", operator: "or", left: l.toAST(), right: r.toAST(), loc: null }; },
        LogicAnd_and(l, _o, r) { return { kind: "BinaryExpr", operator: "and", left: l.toAST(), right: r.toAST(), loc: null }; },
        LogicNot_not(_o, a) { return { kind: "UnaryExpr", operator: "not", argument: a.toAST(), loc: null }; },
        Compare_le(l, _o, r) { return { kind: "BinaryExpr", operator: "<=", left: l.toAST(), right: r.toAST(), loc: null }; },
        Compare_lt(l, _o, r) { return { kind: "BinaryExpr", operator: "<", left: l.toAST(), right: r.toAST(), loc: null }; },
        Compare_ge(l, _o, r) { return { kind: "BinaryExpr", operator: ">=", left: l.toAST(), right: r.toAST(), loc: null }; },
        Compare_gt(l, _o, r) { return { kind: "BinaryExpr", operator: ">", left: l.toAST(), right: r.toAST(), loc: null }; },
        Compare_eq(l, _o, r) { return { kind: "BinaryExpr", operator: "==", left: l.toAST(), right: r.toAST(), loc: null }; },
        Compare_neq(l, _o, r) { return { kind: "BinaryExpr", operator: "!=", left: l.toAST(), right: r.toAST(), loc: null }; },
        AddExp_add(l, _o, r) { return { kind: "BinaryExpr", operator: "+", left: l.toAST(), right: r.toAST(), loc: null }; },
        AddExp_sub(l, _o, r) { return { kind: "BinaryExpr", operator: "-", left: l.toAST(), right: r.toAST(), loc: null }; },
        MulExp_mul(l, _o, r) { return { kind: "BinaryExpr", operator: "*", left: l.toAST(), right: r.toAST(), loc: null }; },
        MulExp_div(l, _o, r) { return { kind: "BinaryExpr", operator: "/", left: l.toAST(), right: r.toAST(), loc: null }; },
        MulExp_mod(l, _o, r) { return { kind: "BinaryExpr", operator: "%", left: l.toAST(), right: r.toAST(), loc: null }; },
        ExpExp_power(l, _o, r) { return { kind: "BinaryExpr", operator: "^", left: l.toAST(), right: r.toAST(), loc: null }; },
        Primary_index(o, _o, i, _c) { return { kind: "IndexExpr", object: o.toAST(), index: i.toAST(), loc: null }; },
        Primary_access(o, _p, id) { return { kind: "MemberExpr", object: o.toAST(), property: id.toAST(), loc: null }; },
        Atom_paren(_o, e, _c) { return e.toAST(); },
        Atom_id(id) { return { kind: "Identifier", ...id.toAST() }; },
        Atom_num(n) { return { kind: "Literal", ...n.toAST() }; },
        Atom_str(s) { return { kind: "Literal", ...s.toAST() }; },
        Atom_bool(b) { return { kind: "Literal", ...b.toAST() }; },
        CallExp(id, _o, a, _c) { return { kind: "CallExpr", callee: { kind: "Identifier", ...id.toAST() }, arguments: list(a), loc: null }; },
        List(_o, i, _c) { return { kind: "ArrayLiteral", elements: list(i), loc: null }; },
        Object(_o, p, _c) { return { kind: "ObjectLiteral", properties: list(p), loc: null }; },
        Prop(k, _cl, v) { return { kind: "Property", key: k.toAST(), value: v.toAST(), loc: null }; },
        identifier(l, rest) {
            return { name: this.sourceString, loc: null };
        },
        number_float(_d1, _p, _d2) { return { value: parseFloat(this.sourceString), raw: this.sourceString, loc: null }; },
        number_int(_d) { return { value: parseInt(this.sourceString), raw: this.sourceString, loc: null }; },
        stringLiteral(_q1, c, _q2) { return { value: c.sourceString, raw: this.sourceString, loc: null }; },
        boolean(v) { return { value: v.sourceString === "true", raw: v.sourceString, loc: null }; },
        _iter(...c) { return c.map(x => x.toAST()); },
        _terminal() { return this.sourceString; }
    });
    console.log("[Worker] Semantics registered.");
}

async function bootstrap() {
    console.log("[Worker] bootstrap() called.");
    if (initError) { console.error("[Worker] bootstrap() skipped due to initError."); throw initError; }
    if ((vm || useJSFallback) && grammar) { console.log("[Worker] bootstrap() already complete."); return; }

    console.log("[Worker] Bootstrapping...");

    try {
        if (!ohm) {
            console.log("[Worker] Dynamically importing Ohm-js...");
            const ohmNamespace = await import('https://esm.sh/ohm-js@17');
            ohm = ohmNamespace.default || ohmNamespace;
            console.log("[Worker] Ohm-js dynamic import successful.");
        }

        console.log("[Worker] Loading grammar...");
        grammar = ohm.grammar(grammarSource);
        console.log("[Worker] Grammar loaded. Creating semantics...");
        semantics = grammar.createSemantics();
        registerSemantics();
        console.log("[Worker] Parser initialization successful.");
    } catch (e) {
        console.error("[Worker] Parser Init Failed:", e);
        initError = e;
        throw e;
    }

    try {
        if (!initWasm) {
            console.log("[Worker] Dynamically importing WASM core...");
            const wasmModule = await import('/wasm/pumpkin_core.js');
            initWasm = wasmModule.default;
            PumpkinVMClass = wasmModule.PumpkinVM;
            console.log("[Worker] WASM core dynamic import successful.");
        }

        console.log("[Worker] Attempting WASM Init...");
        await initWasm();
        console.log("[Worker] WASM init() resolved.");
        vm = new PumpkinVMClass();
        console.log("[Worker] PumpkinVM instantiated.");

        const testRes = vm.run(JSON.stringify({ kind: "Program", body: [], loc: null }));
        if (testRes && testRes.output && testRes.output[0] && testRes.output[0].includes("placeholder")) {
            console.warn("[Worker] Detected WASM Placeholder. Using JS Interpreter.");
            useJSFallback = true;
        } else {
            console.log("[Worker] WASM Core appears functional.");
        }
    } catch (e) {
        console.warn("[Worker] WASM Init Error, using JS fallback:", e);
        useJSFallback = true;
    }
}

self.onmessage = async (e) => {
    console.log("[Worker] Message received:", e.data.type);
    const { type, source } = e.data;
    if (type !== 'EXECUTE') return;

    try {
        await bootstrap();
        console.log("[Worker] Matching source...");
        const match = grammar.match(source);
        if (match.failed()) {
            console.warn("[Worker] Parse failed:", match.message);
            self.postMessage({ type: 'ERROR', payload: { error: `Syntax Error: ${match.message}`, line: 0 } });
            return;
        }

        console.log("[Worker] Building AST...");
        const ast = semantics(match).toAST();

        let result;
        if (useJSFallback) {
            console.log("[Worker] Executing via JS Fallback...");
            capturedOutput.length = 0;
            const runEnv = new Environment(stdlibEnv);
            try {
                evaluateJS(ast, runEnv);
                result = { success: true, output: [...capturedOutput], return_value: null };
            } catch (err) {
                console.error("[Worker] JS Execution Error:", err);
                result = { success: false, output: [...capturedOutput], error: { message: err.message || "Execution Error" } };
            }
        } else {
            console.log("[Worker] Executing via WASM...");
            result = vm.run(JSON.stringify(ast));
        }

        console.log("[Worker] Execution finished. Posting result.");
        self.postMessage({ type: 'SUCCESS', payload: result });
    } catch (err) {
        console.error("[Worker] Critical Error in onmessage:", err);
        self.postMessage({ type: 'ERROR', payload: { error: err.message || "Worker Error", line: 0 } });
    }
};
