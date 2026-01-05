
import * as fs from 'fs';
import * as path from 'path';
import { parseToAST } from './parser.js';
import { evaluate, globalEnv } from './interpreter.js';
import { printError, PumpkinError } from './errors.js';


export function runFile(filename: string) {
    const filePath = path.resolve(process.cwd(), filename);

    try {
        if (!fs.existsSync(filePath)) {
            console.error(`Error: File not found: ${filePath}`);
            process.exit(1);
        }

        const code = fs.readFileSync(filePath, 'utf-8');

        // Parse AST
        const ast = parseToAST(code);

        // Evaluate
        evaluate(ast, globalEnv);

    } catch (e: any) {
        if (e instanceof PumpkinError) {
            printError(e);
        } else {
            // Check if it's the specific grammar error from parser wrapper
            if (e.message && e.message.startsWith('Line')) {
                console.log(e.message);
            } else {
                console.error('Runtime Error:', e?.message || e);
            }
        }
        process.exit(1);
    }
}
