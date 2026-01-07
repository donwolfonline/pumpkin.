/**
 * CLI Error Renderer
 *
 * Formats errors for terminal output with ANSI colors.
 */
// Simple ANSI color codes (avoiding external deps for now)
const colors = {
    red: (s) => `\x1b[31m${s}\x1b[0m`,
    yellow: (s) => `\x1b[33m${s}\x1b[0m`,
    cyan: (s) => `\x1b[36m${s}\x1b[0m`,
    dim: (s) => `\x1b[2m${s}\x1b[0m`,
    bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
export function renderError(error) {
    // Handle PumpkinError
    if (error instanceof Error && 'what' in error) {
        const pError = error;
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
//# sourceMappingURL=cli.js.map