
// src/renderer/browser.tsx

/**
 * Browser Error Renderer
 * React components for displaying errors and output in the web playground.
 */

import React from 'react';
import type { PumpkinError } from '../errors';

interface ErrorDisplayProps {
    error: PumpkinError;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    const getMessage = (): string => {
        if (error.message) {
            return error.message;
        }
        if (error.expected && error.actual) {
            return `Expected ${error.expected}, but got ${error.actual}.`;
        }
        if (error.name) {
            return `Variable '${error.name}' is not defined.`;
        }
        return "Unknown error";
    };

    return (
        <div className="pumpkin-error-display">
            <div className="error-header">
                <span className="error-icon">🚨</span>
                <span className="error-kind">{error.kind}</span>: {getMessage()}
            </div>
            {error.location && (
                <div className="error-location">
                    at line {error.location.line}, column {error.location.col}
                </div>
            )}
            {error.hint && (
                <div className="error-hint">
                    <span className="hint-icon">💡</span> Hint: {error.hint}
                </div>
            )}
        </div>
    );
};

interface OutputDisplayProps {
    lines: string[];
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ lines }) => {
    if (lines.length === 0) {
        return null;
    }

    return (
        <div className="pumpkin-output-display">
            {lines.map((line, index) => (
                <div key={index} className="output-line">
                    {line}
                </div>
            ))}
        </div>
    );
};

// Optional: Combined Result Display
interface ResultDisplayProps {
    output: string[];
    error?: PumpkinError;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ output, error }) => {
    return (
        <div className="pumpkin-result-display">
            {output.length > 0 && <OutputDisplay lines={output} />}
            {error && <ErrorDisplay error={error} />}
        </div>
    );
};
