#!/usr/bin/env node
import { runFile } from './run.js';
import { startRepl } from './repl.js';
const args = process.argv.slice(2);
const command = args[0];
function printHelp() {
    console.log(`
🎃 Pumpkin CLI

Usage:
  pumpkin run <file>    Run a Pumpkin program
  pumpkin repl          Start interactive mode
  pumpkin format <file> Format a Pumpkin program (Coming Soon)
  pumpkin -h, --help    Show this help message

Examples:
  pumpkin run script.pumpkin
  pumpkin repl
`);
}
if (!command || command === '-h' || command === '--help') {
    printHelp();
    process.exit(0);
}
switch (command) {
    case 'run':
        const file = args[1];
        if (!file) {
            console.error('Error: Please specify a file to run.');
            process.exit(1);
        }
        runFile(file);
        break;
    case 'repl':
        startRepl();
        break;
    case 'format':
        console.log('✨ Format feature is coming soon!');
        break;
    default:
        // Attempt to run as file if direct path provided?
        // Let's stick to explicit commands for clarity, or check if file.
        if (command.endsWith('.pumpkin')) {
            runFile(command);
        }
        else {
            console.error(`Unknown command: ${command}`);
            if (command === 'help')
                printHelp();
            else
                console.log('Try "pumpkin --help" for available commands.');
            process.exit(1);
        }
        break;
}
//# sourceMappingURL=cli.js.map