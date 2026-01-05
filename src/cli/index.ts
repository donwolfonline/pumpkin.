
// src/cli/index.ts

import { runCommand } from './run.js';
import { replCommand } from './repl.js';

const VERSION = "0.1.0";

export function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    // Default to friendly help if no command provided
    if (!command) {
        printHelp();
        console.log("\n💡 Tip: Try running 'pumpkin repl' to play interactively!");
        return;
    }

    switch (command) {
        case 'run':
            const file = args[1];
            if (!file) {
                console.error("❌ I need a file to run.");
                console.error("Usage: pumpkin run <file.pumpkin>");
                process.exit(1);
            }
            runCommand(file);
            break;

        case 'repl':
            replCommand();
            break;

        case 'version':
        case '-v':
        case '--version':
            console.log(`🎃 Pumpkin v${VERSION}`);
            break;

        case 'help':
        case '--help':
        case '-h':
            printHelp();
            break;

        default:
            console.error(`❌ I don't know the command '${command}'.`);
            console.error("Try 'pumpkin help' to see what I can do.");
            process.exit(1);
    }
}

function printHelp() {
    console.log(`
🎃 Pumpkin v${VERSION} - The friendly language for learning.

Usage:
  pumpkin <command> [options]

Commands:
  run     Execute a Pumpkin program file
  repl    Start the interactive playground
  help    Show this help message
  version Show the current version

Examples:
  pumpkin run hello.pumpkin
  pumpkin repl

Need help? Visit https://pumpkin-lang.org/docs
    `);
}
