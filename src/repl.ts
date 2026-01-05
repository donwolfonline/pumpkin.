
import * as readlineSync from 'readline-sync';
import { parse } from './parser.js';
import { evaluate, resetEnv } from './interpreter.js';

console.log('Welcome to Pumpkin 🎃 v1.0.0');
console.log('Type "exit" to quit, "clear" to reset.');

let buffer = '';
let openBraces = 0;

function countBraces(str: string): number {
    let count = 0;
    for (const char of str) {
        if (char === '{') count++;
        else if (char === '}') count--;
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
            resetEnv();
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
            const { match } = parse(buffer);
            if (match.failed()) {
                console.log(match.message);
            } else {
                const result = evaluate(match);
                // Only print result if it's a value and not undefined (e.g. from a pure statement like LetDecl)
                // However, our interpreter returns values for everything.
                // LetDecl returns undefined (void).
                // Expressions return values.
                // Let's print if strictly not undefined.
                if (result !== undefined) {
                    console.log(result);
                }
            }
        } catch (e: any) {
            console.log('Runtime Error:', e.message);
        }

        buffer = '';
        openBraces = 0;
    }
}
