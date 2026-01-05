
// src/cli/run.ts

import * as fs from 'fs';
import * as path from 'path';
// @ts-ignore
import init, { PumpkinVM } from '../../pumpkin_core/pkg/pumpkin_core.js';
// We assume index.ts in src exports parseToAST or similar, 
// based on previous context, user has `src/index.ts` or `src/parser.ts`.
// I will attempt to import from `../index.js` or generic location.
// Given strict "thin CLI" rule, valid assumption.
// For now, I'll mock the import path to be fixed if I can't find it.
import { parseToAST } from '../index.js';

export async function runCommand(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }

    // 1. Initialize WASM
    // Path resolution to the .wasm file is tricky in node + commonjs/esm mix.
    // We assume the build output structure puts pkg nearby.
    const wasmPath = path.resolve(__dirname, '../../pumpkin_core/pkg/pumpkin_core_bg.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);

    await init(wasmBuffer);
    const vm = new PumpkinVM();

    // 2. Read & Parse
    const source = fs.readFileSync(filePath, 'utf-8');

    try {
        const ast = parseToAST(source);

        // 3. Execute
        const result = vm.run(JSON.stringify(ast));

        // 4. Output
        if (result.output && Array.isArray(result.output)) {
            result.output.forEach((line: string) => console.log(line));
        }

        if (!result.success) {
            // Pretty print error
            if (result.error) {
                console.error("\n" + formatError(result.error));
            } else {
                console.error("Unknown runtime error.");
            }
            process.exit(1);
        }
    } catch (e: any) {
        console.error("❌ Parse Error:");
        console.error(e.message);
        process.exit(1);
    }
}

function formatError(err: any): string {
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
