
import { parseToAST } from '../src/parser.js';
import * as util from 'util';

const code = `
let x = 10
if x > 5 {
    show "Big"
}
`;

console.log("--- Source Code ---");
console.log(code.trim());

try {
    const ast = parseToAST(code);
    console.log("\n--- AST ---");
    console.log(util.inspect(ast, { showHidden: false, depth: null, colors: true }));
    console.log("\n✅ AST Generated Successfully");
} catch (e: any) {
    console.error("❌ AST Generation Failed:", e.message);
    process.exit(1);
}
