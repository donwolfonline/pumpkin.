
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { Console } from './Console';
import { Play, RotateCcw } from 'lucide-react';

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
        workerRef.current = new Worker('/workers/pumpkin.worker.js', { type: 'module' });

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const timeoutId = setTimeout(() => {
            if (isRunning) {
                setIsRunning(false);
                setError({ message: "Execution timed out (Infinite loop?) 🕒" });
                workerRef.current?.terminate();
                // Re-init worker
                workerRef.current = new Worker('/workers/pumpkin.worker.js', { type: 'module' });
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
        <div className="flex flex-col h-[85vh] w-full max-w-6xl mx-auto border-4 border-gray-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden bg-white">
            {/* Header / Toolbar */}
            <div className="bg-pumpkin-orange p-3 md:p-4 flex flex-wrap gap-4 items-center justify-between border-b-4 border-gray-900 shrink-0">
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border-2 border-gray-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <span className="text-2xl animate-bounce">🎃</span>
                    <span className="font-black text-gray-900 tracking-tight">Pumpkin IDE</span>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 font-bold text-gray-700 bg-white border-2 border-gray-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none transition-all"
                        title="Reset Code"
                    >
                        <RotateCcw size={18} />
                        <span className="inline">Reset</span>
                    </button>

                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`flex items-center gap-2 px-6 py-2 font-black text-white border-2 border-gray-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all
                            ${isRunning
                                ? 'bg-gray-400 cursor-not-allowed translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                : 'bg-green-500 hover:bg-green-400 hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:shadow-none'
                            }`}
                    >
                        {isRunning ? (
                            <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full" />
                        ) : (
                            <Play size={20} fill="currentColor" />
                        )}
                        {isRunning ? 'RUNNING...' : 'RUN CODE'}
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-gray-100">
                {/* Editor Pane */}
                <div className="flex-1 border-b-4 lg:border-b-0 lg:border-r-4 border-gray-900 relative min-h-[50vh] lg:min-h-full">
                    <CodeEditor code={code} onChange={setCode} />
                </div>

                {/* Console Pane */}
                <div className="flex-1 min-h-[35vh] lg:min-h-full bg-gray-900 p-2 md:p-4 overflow-hidden">
                    <Console output={output} error={error} />
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white border-t-4 border-gray-900 p-2 text-xs font-mono font-bold text-gray-500 flex justify-between uppercase tracking-wider shrink-0">
                <span>pumpkin v0.1.0</span>
                <span className={isRunning ? 'text-green-600 animate-pulse' : 'text-gray-400'}>
                    {isRunning ? '● BUSY' : '○ READY'}
                </span>
            </div>
        </div>
    );
}
