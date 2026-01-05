
import * as fs from 'fs';
import * as path from 'path';
import { parseToAST } from '../src/index.js';

const args = process.argv.slice(2);
const filename = args[0];

if (!filename) {
    console.error("Usage: node tools/inspect_ast.js <file>");
    process.exit(1);
}

const filePath = path.resolve(process.cwd(), filename);
const code = fs.readFileSync(filePath, 'utf-8');

try {
    const ast = parseToAST(code);
    console.log(JSON.stringify(ast, null, 2));
} catch (e: any) {
    console.error("Error parsing AST:", e.message);
    process.exit(1);
}
