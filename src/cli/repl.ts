
// src/cli/repl.ts

import * as readlineSync from 'readline-sync';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// @ts-ignore
import { PumpkinVM } from '../../pumpkin_core/pkg/pumpkin_core.js';
// @ts-ignore
import { parseToAST } from '../parser.js';


export async function replCommand() {
    console.log("🎃 Pumpkin REPL v0.1.8");
    console.log("Type 'exit' to quit.\n");

    // 1. Initialize VM (WASM is auto-loaded by the nodejs target bridge)
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
