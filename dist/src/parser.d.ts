import * as ohm from 'ohm-js';
export interface ParseResult {
    match: ohm.MatchResult;
}
import * as AST from './ast/nodes.js';
export declare function parse(code: string): ParseResult;
export declare function parseToAST(sourceCode: string): AST.Program;
//# sourceMappingURL=parser.d.ts.map