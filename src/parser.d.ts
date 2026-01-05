import * as ohm from 'ohm-js';
export declare const grammar: ohm.Grammar;
export interface ParseResult {
    match: ohm.MatchResult;
}
export declare function parse(code: string): ParseResult;
//# sourceMappingURL=parser.d.ts.map