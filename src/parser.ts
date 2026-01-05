
import * as ohm from 'ohm-js';
import { grammar } from './ohm_grammar.js';

export interface ParseResult {
    match: ohm.MatchResult;
}


import semantics from './ast/semantics.js';
import * as AST from './ast/nodes.js';

export function parse(code: string): ParseResult {
    const match = grammar.match(code);
    return { match };
}

export function parseToAST(sourceCode: string): AST.Program {
    const match = grammar.match(sourceCode);
    if (match.failed()) {
        throw new Error(match.message);
    }
    return semantics(match).toAST();
}
