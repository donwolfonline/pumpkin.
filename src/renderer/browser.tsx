/**
 * Browser Error Renderer
 * 
 * Formats errors for browser display (e.g. in a playground).
 */

import React from 'react';
import type { PumpkinError } from '../errors.js';

interface ErrorDisplayProps {
    error: PumpkinError | Error | any;
}

interface OutputDisplayProps {
    output: string[];
}

interface ResultDisplayProps {
    output?: string[];
    error?: PumpkinError | Error | any;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    const getMessage = () => {
        if (error instanceof Error && 'what' in error) {
            return (error as any).what || error.message;
        }
        return String(error.message || error);
    };

    return (
        <div className="pumpkin-error-display">
            <div className="error-header">
                <span className="error-icon">🚨</span>
                <span className="error-title">Error</span>
            </div>
            <div className="error-message">{getMessage()}</div>
        </div>
    );
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ output }) => {
    return (
        <div className="pumpkin-output-display">
            {output.map((line, index) => (
                <div key={index} className="output-line">
                    {line}
                </div>
            ))}
        </div>
    );
};

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ output, error }) => {
    return (
        <div className="pumpkin-result-display">
            {error ? <ErrorDisplay error={error} /> : output && <OutputDisplay output={output} />}
        </div>
    );
};
