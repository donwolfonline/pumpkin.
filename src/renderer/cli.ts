/**
 * CLI Error Renderer
 * 
 * Formats errors for terminal output with ANSI colors.
 */

import type { PumpkinError } from '../errors.js';

// Simple ANSI color codes (avoiding external deps for now)
const colors = {
    red: (s: string) => `\x1b[31m${s}\x1b[0m`,
    yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
    cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
    dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
    bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

export function renderError(error: PumpkinError | Error | any): string {
    // Handle PumpkinError
    if (error instanceof Error && 'what' in error) {
        const pError = error as any;
        let output = colors.red(`🚨 Error: `);
        output += pError.what || error.message || error.toString();

        if (pError.why) {
            output += `\n   ${colors.dim(pError.why)}`;
        }

        if (pError.how) {
            output += `\n   💡 ${colors.cyan('Hint:')} ${pError.how}`;
        }

        return output;
    }

    // Fallback for generic errors
    return colors.red(`🚨 Error: `) + (error.message || error.toString());
}
