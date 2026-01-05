
import { parseToAST } from './parser.js';
import { evaluate, resetGlobalEnv, globalEnv } from './interpreter.js';

function test(name: string, code: string, expected: any) {
    process.stdout.write(`Testing ${name}... `);
    try {
        resetGlobalEnv();
        const ast = parseToAST(code);
        const result = evaluate(ast, globalEnv);

        if (result === expected) {
            console.log('✅ PASS');
        } else {
            console.log(`❌ FAIL (Expected ${expected}, got ${result})`);
            process.exit(1);
        }
    } catch (e: any) {
        console.log(`❌ FAIL (Error: ${e.message})`);
        process.exit(1);
    }
}

// Basic Math
test('Addition', '1 + 2', 3);
test('Subtraction', '5 - 2', 3);
test('Multiplication', '3 * 4', 12);
test('Division', '10 / 2', 5);

// Variables
test('Let Declaration', 'let x = 10\nx', 10);
test('Reassignment', 'let y = 5\ny = 7\ny', 7);

// Logic
test('Logic Or', 'true or false', true);
test('Logic And', 'true and false', false);
