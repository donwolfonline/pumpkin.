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
export declare const ErrorDisplay: React.FC<ErrorDisplayProps>;
export declare const OutputDisplay: React.FC<OutputDisplayProps>;
export declare const ResultDisplay: React.FC<ResultDisplayProps>;
export {};
//# sourceMappingURL=browser.d.ts.map