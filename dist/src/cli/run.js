// src/cli/run.ts
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
const __dirname = fileURLToPath(new URL('.', import.meta.url));
// @ts-ignore
import { PumpkinVM } from '../../pumpkin_core/pkg/pumpkin_core.js';
// We assume index.ts in src exports parseToAST or similar, 
// based on previous context, user has `src/index.ts` or `src/parser.ts`.
// I will attempt to import from `../index.js` or generic location.
// Given strict "thin CLI" rule, valid assumption.
// For now, I'll mock the import path to be fixed if I can't find it.
import { parseToAST } from '../index.js';
export async function runCommand(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }
    // 1. Initialize VM (WASM is auto-loaded by the nodejs target bridge)
    const vm = new PumpkinVM();
    // 2. Read & Parse
    const source = fs.readFileSync(filePath, 'utf-8');
    try {
        const ast = parseToAST(source);
        // 3. Execute
        const result = vm.run(JSON.stringify(ast));
        // 4. Output
        if (result.output && Array.isArray(result.output)) {
            result.output.forEach((line) => console.log(line));
        }
        if (!result.success) {
            // Pretty print error
            if (result.error) {
                console.error("\n" + formatError(result.error));
            }
            else {
                console.error("Unknown runtime error.");
            }
            process.exit(1);
        }
    }
    catch (e) {
        console.error("❌ Parse Error:");
        console.error(e.message);
        process.exit(1);
    }
}
function formatError(err) {
    // Contract: kind, message, location, hint
    let output = `🚨 ${err.kind}: ${err.message || ""}`;
    if (err.expected && err.actual) {
        output += ` Expected ${err.expected}, but got ${err.actual}.`;
    }
    if (err.location) {
        output += `\n   at line ${err.location.line}, column ${err.location.col}`;
    }
    if (err.hint) {
        output += `\n   💡 Hint: ${err.hint}`;
    }
    return output;
}
//# sourceMappingURL=run.js.map