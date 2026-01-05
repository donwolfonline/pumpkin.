
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { Console } from './Console';
import { Play, RotateCcw, MonitorPlay } from 'lucide-react';

const DEFAULT_CODE = `// Welcome to Pumpkin 🎃
// A friendly language for learning.

let name = "Pumpkin"
show "Hello " + name

// Try changing the number below:
let count = 0
repeat 3 {
    count = count + 1
    show count
}
`;

export function PumpkinIDE() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<{ message: string; line?: number } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const workerRef = useRef<Worker | null>(null);

    // Initial Worker Setup
    useEffect(() => {
        workerRef.current = new Worker('/workers/pumpkin.worker.ts', { type: 'module' });

        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;
            setIsRunning(false);

            if (type === 'SUCCESS') {
                setOutput(payload.output || []);
                setError(null);
            } else if (type === 'ERROR') {
                setOutput(payload.output || []); // Might have partial output
                setError({
                    message: payload.error,
                    line: payload.line
                });
            }
        };

        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const handleRun = useCallback(() => {
        if (!workerRef.current) return;
        setIsRunning(true);
        setError(null);
        setOutput([]); // Clear previous output

        // Timeout protection (5s watchdog)
        const timeoutId = setTimeout(() => {
            if (isRunning) {
                setIsRunning(false);
                setError({ message: "Execution timed out (Infinite loop?) 🕒" });
                workerRef.current?.terminate();
                // Re-init worker
                workerRef.current = new Worker('/workers/pumpkin.worker.ts', { type: 'module' });
            }
        }, 5000);

        workerRef.current.postMessage({
            type: 'EXECUTE',
            source: code
        });
    }, [code, isRunning]);

    const handleReset = () => {
        setCode(DEFAULT_CODE);
        setOutput([]);
        setError(null);
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-5xl mx-auto border border-gray-200 rounded-xl shadow-2xl overflow-hidden bg-white">
            {/* Header / Toolbar */}
            <div className="bg-gray-50 border-b border-gray-200 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🎃</span>
                    <span className="font-bold text-gray-700">Pumpkin Playground</span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                        title="Reset Code"
                    >
                        <RotateCcw size={16} />
                        Reset
                    </button>

                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold text-white rounded-md shadow-sm transition-all
                            ${isRunning
                                ? 'bg-orange-300 cursor-not-allowed'
                                : 'bg-orange-500 hover:bg-orange-600 active:scale-95'
                            }`}
                    >
                        {isRunning ? (
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                            <Play size={16} fill="currentColor" />
                        )}
                        {isRunning ? 'Running...' : 'Run'}
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0">
                {/* Editor Pane */}
                <div className="flex-1 border-b md:border-b-0 md:border-r border-gray-200 relative min-h-[50%] md:min-h-full">
                    <CodeEditor code={code} onChange={setCode} />
                    {/* Mobile Run Button Floating (Optional, sticking to header for now) */}
                </div>

                {/* Console Pane */}
                <div className="flex-1 min-h-[50%] md:min-h-full bg-gray-900">
                    <Console output={output} error={error} />
                </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-200 px-3 py-1 text-xs text-gray-500 flex justify-between">
                <span>pumpkin-lang v0.1.0</span>
                <span>{isRunning ? 'Executing...' : 'Ready'}</span>
            </div>
        </div>
    );
}
