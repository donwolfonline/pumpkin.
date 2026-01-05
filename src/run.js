import * as fs from 'fs';
import * as path from 'path';
import { parse } from './parser.js';
import { evaluate, resetEnv } from './interpreter.js';
import { printError, PumpkinError } from './errors.js';
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Usage: node --loader ts-node/esm src/run.ts <filename.pumpkin>');
    process.exit(1);
}
const filename = args[0];
const filePath = path.resolve(process.cwd(), filename);
console.log(`Running ${filename}...`);
try {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filePath}`);
        process.exit(1);
    }
    const code = fs.readFileSync(filePath, 'utf-8');
    console.log('File read. Parsing...');
    const { match } = parse(code);
    if (match.failed()) {
        console.log('Parse failed:');
        console.log(match.message);
        process.exit(1);
    }
    console.log('Parse successful. Evaluating...');
    evaluate(match);
    console.log('Evaluation complete.');
}
catch (e) {
    console.log('Caught error:', e);
    if (e instanceof PumpkinError) {
        printError(e);
    }
    else {
        console.error('Runtime Error:', e?.message || e);
    }
}
//# sourceMappingURL=run.js.map