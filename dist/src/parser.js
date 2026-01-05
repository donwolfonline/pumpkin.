import * as ohm from 'ohm-js';
import { grammar } from './ohm_grammar.js';
import semantics from './ast/semantics.js';
import * as AST from './ast/nodes.js';
export function parse(code) {
    const match = grammar.match(code);
    return { match };
}
export function parseToAST(sourceCode) {
    const match = grammar.match(sourceCode);
    if (match.failed()) {
        throw new Error(match.message);
    }
    return semantics(match).toAST();
}
//# sourceMappingURL=parser.js.map