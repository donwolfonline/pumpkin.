
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

const filename = args[0]!;
const filePath = path.resolve(process.cwd(), filename);

try {
    if (!fs.existsSync(filePath)) {
        console.error(`Error: File not found: ${filePath}`);
        process.exit(1);
    }

    const code = fs.readFileSync(filePath, 'utf-8');
    const { match } = parse(code);

    if (match.failed()) {
        console.log(match.message);
        process.exit(1);
    }

    evaluate(match);

} catch (e: any) {
    if (e instanceof PumpkinError) {
        printError(e);
    } else {
        console.error('Runtime Error:', e?.message || e);
    }
}
