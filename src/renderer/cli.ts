
// src/renderer/cli.ts

/**
 * CLI Error Renderer
 * Formats errors for terminal output with ANSI colors.
 */

import type { PumpkinError } from '../errors';

// Simple ANSI color codes (avoiding external deps for now)
const colors = {
    red: (s: string) => `\x1b[31m${s}\x1b[0m`,
    yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
    cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
    dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
};

export function renderError(error: PumpkinError): string {
    let output = colors.red(`🚨 ${error.kind}: `);

    // Build message based on error type
    if (error.message) {
        output += error.message;
    } else if (error.expected && error.actual) {
        output += `Expected ${colors.yellow(error.expected)}, but got ${colors.yellow(error.actual)}.`;
    } else if (error.name) {
        output += `Variable '${colors.yellow(error.name)}' is not defined.`;
    }

    // Add location if available
    if (error.location) {
        output += `\n   ${colors.dim(`at line ${error.location.line}, column ${error.location.col}`)}`;
    }

    // Add hint if available
    if (error.hint) {
        output += `\n   💡 ${colors.cyan('Hint:')} ${error.hint}`;
    }

    return output;
}

export function renderOutput(lines: string[]): void {
    lines.forEach(line => console.log(line));
}
