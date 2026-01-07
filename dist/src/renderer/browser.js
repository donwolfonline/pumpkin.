import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Browser Error Renderer
 *
 * Formats errors for browser display (e.g. in a playground).
 */
import React from 'react';
export const ErrorDisplay = ({ error }) => {
    const getMessage = () => {
        if (error instanceof Error && 'what' in error) {
            return error.what || error.message;
        }
        return String(error.message || error);
    };
    return (_jsxs("div", { className: "pumpkin-error-display", children: [_jsxs("div", { className: "error-header", children: [_jsx("span", { className: "error-icon", children: "\uD83D\uDEA8" }), _jsx("span", { className: "error-title", children: "Error" })] }), _jsx("div", { className: "error-message", children: getMessage() })] }));
};
export const OutputDisplay = ({ output }) => {
    return (_jsx("div", { className: "pumpkin-output-display", children: output.map((line, index) => (_jsx("div", { className: "output-line", children: line }, index))) }));
};
export const ResultDisplay = ({ output, error }) => {
    return (_jsx("div", { className: "pumpkin-result-display", children: error ? _jsx(ErrorDisplay, { error: error }) : output && _jsx(OutputDisplay, { output: output }) }));
};
//# sourceMappingURL=browser.js.map