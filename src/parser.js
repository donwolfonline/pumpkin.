import * as path from 'path';
import * as fs from 'fs';
import * as customUrl from 'url';
import * as ohm from 'ohm-js';
const __dirname = customUrl.fileURLToPath(new URL('.', import.meta.url));
const grammarPath = path.join(__dirname, '..', 'pumpkin.ohm');
const grammarSource = fs.readFileSync(grammarPath, 'utf-8');
export const grammar = ohm.grammar(grammarSource);
export function parse(code) {
    const match = grammar.match(code);
    return { match };
}
//# sourceMappingURL=parser.js.map