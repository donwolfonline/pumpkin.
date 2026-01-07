// src/cli/index.ts
import { runCommand } from './run.js';
import { replCommand } from './repl.js';
const VERSION = "0.1.7";
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
            console.log("\n💡 Want icons and syntax highlighting in VS Code?");
            console.log("   Run: pumpkin install-extension\n");
            break;
        case 'install-extension':
            installExtension();
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
function installExtension() {
    const { exec } = req('child_process');
    console.log("🔍 Looking for VS Code...");
    exec('code --install-extension citrullix.pumpkin-vscode', (error, stdout, stderr) => {
        if (error) {
            console.error("❌ I couldn't find the 'code' command in your path.");
            console.log("\nTo get icons manually:");
            console.log("1. Open VS Code.");
            console.log("2. Search for 'Pumpkin Language Support' in Extensions.");
            console.log("3. Click Install.");
            return;
        }
        console.log(stdout);
        console.log("✨ Successfully requested extension installation!");
        console.log("   Restart VS Code to see your new pumpkin icons. 🎃");
    });
}
// Simple helper for dynamic require if needed for node built-ins in ESM
function req(module) {
    const { createRequire } = require('module');
    const require_ = createRequire(import.meta.url);
    return require_(module);
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
  install-extension Install VS Code support (icons & syntax)

Examples:
  pumpkin run hello.pumpkin
  pumpkin repl

Need help? Visit https://pumpkin-lang.org/docs
    `);
}
//# sourceMappingURL=index.js.map