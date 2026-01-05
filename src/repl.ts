
import * as readlineSync from 'readline-sync';
import { parseToAST } from './parser.js';
import { evaluate, resetGlobalEnv, globalEnv } from './interpreter.js';


export function startRepl() {
    console.log('Welcome to Pumpkin 🎃 v1.0.0');
    console.log('Type "exit" to quit, "clear" to reset.');

    let buffer = '';
    let openBraces = 0;

    function countBraces(str: string): number {
        let count = 0;
        for (const char of str) {
            if (char === '{' || char === '(' || char === '[') count++;
            else if (char === '}' || char === ')' || char === ']') count--;
        }
        return count;
    }

    while (true) {
        const prompt = buffer.length > 0 ? '... ' : '🎃 > ';
        const line = readlineSync.question(prompt);

        if (buffer.length === 0) {
            if (line.trim() === 'exit') {
                console.log('Bye! 👋');
                process.exit(0);
            }
            if (line.trim() === 'clear') {
                console.clear();
                resetGlobalEnv();
                buffer = '';
                openBraces = 0;
                continue;
            }
        }

        buffer += line + '\n';
        openBraces += countBraces(line);

        if (openBraces <= 0) {
            if (openBraces < 0) {
                console.log("Error: Unexpected '}'");
                buffer = '';
                openBraces = 0;
                continue;
            }

            if (buffer.trim() === '') {
                buffer = '';
                continue;
            }


            try {
                const ast = parseToAST(buffer);

                const result = evaluate(ast, globalEnv);
                if (result !== undefined) {
                    console.log(result);
                }

            } catch (e: any) {
                // If it's a PumpkinError, it's already friendly. But currently our errors.ts prints directly using 'console.log'?
                // interpreter.ts throws raw errors or PumpkinErrors.
                // repl.ts was catching 'e' and logging `Runtime Error: e.message`.
                // We should use printError if available.
                // We need to import printError.
                if (e.name && e.name.includes('Pumpkin')) { // loose check or import PumpkinError
                    // Let's just log message for now, or improve import to use printError
                    console.log('🎃 Runtime Error:', e.message);
                } else {
                    console.log('Runtime Error:', e.message);
                }
            }

            buffer = '';
            openBraces = 0;
        }
    }
}
