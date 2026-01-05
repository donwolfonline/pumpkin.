
// src/cli/repl.ts

import * as readlineSync from 'readline-sync';
import * as path from 'path';
import * as fs from 'fs';
// @ts-ignore
import init, { PumpkinVM } from '../../pumpkin_core/pkg/pumpkin_core.js';
// @ts-ignore
import { parseToAST } from '../parser.js';

export async function replCommand() {
    console.log("🎃 Pumpkin REPL v0.1.0");
    console.log("Type 'exit' to quit.\n");

    // 1. Initialize WASM
    const wasmPath = path.resolve(__dirname, '../../pumpkin_core/pkg/pumpkin_core_bg.wasm');
    const wasmBuffer = fs.readFileSync(wasmPath);

    await init(wasmBuffer);
    const vm = new PumpkinVM();

    while (true) {
        const input = readlineSync.question('>>> ');

        if (input.trim() === 'exit') {
            break;
        }

        if (input.trim() === '') {
            continue;
        }

        try {
            const ast = parseToAST(input);
            const result = vm.run(JSON.stringify(ast));

            // Output stdout
            if (result.output && Array.isArray(result.output)) {
                result.output.forEach((line: string) => console.log(line));
            }

            if (!result.success && result.error) {
                console.error(`Error: ${result.error.kind}: ${result.error.message}`);
                continue;
            }

            // Output return value?
            // "Show" handles printing usually. 
            // If the last statement is an expression, we might want to print it (like Node/Python repl).
            // The logic for "implicit return print" depends on AST structure or VM flag.
            // For v0.1: Only explicit `show` prints.

        } catch (e: any) {
            console.error("Parse Error: " + e.message);
        }
    }
}
