
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { Console } from './Console';
import { Play, RotateCcw } from 'lucide-react';

const DEFAULT_CODE = `# Welcome to Pumpkin 🎃
# A language for safety and delight.

# Let's start with a variable
let name = "Pumpkin"

# Show something in the console
show "Hello from " + name + "!"

# Try a loop
let i = 1
while i <= 5 {
    show "Line " + i
    i = i + 1
}
`;

export function PumpkinIDE() {
    const [code, setCode] = useState(DEFAULT_CODE);
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<{ message: string; line?: number } | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const isRunningRef = useRef(false);
    const workerRef = useRef<Worker | null>(null);

    // Initial Worker Setup
    useEffect(() => {
        workerRef.current = new Worker('/workers/pumpkin.worker.js', { type: 'module' });

        workerRef.current.onmessage = (e) => {
            const { type, payload } = e.data;
            setIsRunning(false);
            isRunningRef.current = false;

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
        isRunningRef.current = true;
        setError(null);
        setOutput([]); // Clear previous output

        // Timeout protection (10s watchdog for safety)
        setTimeout(() => {
            if (isRunningRef.current) {
                setIsRunning(false);
                isRunningRef.current = false;
                setError({ message: "Execution timed out (Infinite loop?) 🕒" });
                workerRef.current?.terminate();
                // Re-init worker
                workerRef.current = new Worker('/workers/pumpkin.worker.js', { type: 'module' });
                // Re-attach message handler (same as useEffect)
                workerRef.current.onmessage = (e) => {
                    const { type, payload } = e.data;
                    setIsRunning(false);
                    isRunningRef.current = false;
                    if (type === 'SUCCESS') { setOutput(payload.output || []); setError(null); }
                    else if (type === 'ERROR') { setOutput(payload.output || []); setError({ message: payload.error, line: payload.line }); }
                };
            }
        }, 10000);

        workerRef.current.postMessage({
            type: 'EXECUTE',
            source: code
        });
    }, [code]);

    const handleReset = () => {
        setCode(DEFAULT_CODE);
        setOutput([]);
        setError(null);
    };

    return (
        <div className="flex flex-col h-[85vh] w-full max-w-6xl mx-auto bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/20 shadow-2xl overflow-hidden relative group">
            {/* Decorative Glows */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-pumpkin-orange/10 blur-[100px] pointer-events-none rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-teal-accent/10 blur-[100px] pointer-events-none rounded-full" />

            {/* Header / Toolbar */}
            <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 flex flex-wrap gap-4 items-center justify-between border-b border-gray-200 shrink-0 relative z-10">
                <div className="flex items-center gap-4 bg-white/40 px-5 py-2.5 rounded-full border border-white/40 shadow-sm transition-all hover:bg-white/60">
                    <span className="text-2xl animate-bounce">🎃</span>
                    <span className="font-heading font-black text-gray-900 tracking-tight">Pumpkin IDE</span>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-5 py-2.5 font-bold text-gray-700 bg-white/40 backdrop-blur-md border border-white/40 rounded-full shadow-sm hover:bg-white/60 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                        title="Reset Code"
                    >
                        <RotateCcw size={18} />
                        <span className="inline">Reset</span>
                    </button>

                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`btn btn-primary px-8 py-2.5 flex items-center gap-2 group transition-all
                            ${isRunning ? 'opacity-50 cursor-not-allowed translate-y-0' : 'hover:-translate-y-1 active:translate-y-0'}`}
                    >
                        {isRunning ? (
                            <div className="animate-spin h-5 w-5 border-4 border-white/30 border-t-white rounded-full" />
                        ) : (
                            <Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                        )}
                        <span>{isRunning ? 'RUNNING...' : 'RUN CODE'}</span>
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-gray-50/10 relative z-10">
                {/* Editor Pane */}
                <div className="flex-1 border-b lg:border-b-0 lg:border-r border-gray-200 relative min-h-[50vh] lg:min-h-full">
                    <CodeEditor code={code} onChange={setCode} error={error} />
                </div>

                {/* Console Pane */}
                <div className="flex-1 min-h-[35vh] lg:min-h-full bg-white p-4 md:p-8 overflow-hidden relative">
                    {/* Console Inner Glow */}
                    <div className="absolute inset-0 bg-teal-accent/5 pointer-events-none blur-3xl opacity-50" />
                    <div className="relative z-10 h-full">
                        <Console output={output} error={error} />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white/20 backdrop-blur-md border-t border-gray-200 p-4 text-[10px] md:text-xs font-heading font-black text-gray-500 flex justify-between uppercase tracking-[0.2em] shrink-0 relative z-10">
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-pumpkin-orange shadow-[0_0_10px_rgba(255,140,26,0.5)]" />
                    <span>pumpkin runtime v0.1.8</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className={isRunning ? 'text-teal-accent animate-pulse flex items-center gap-2' : 'text-gray-400 flex items-center gap-2'}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-teal-accent shadow-[0_0_8px_#4FD1C5]' : 'bg-gray-400'}`} />
                        {isRunning ? 'EXECUTING' : 'READY'}
                    </span>
                </div>
            </div>
        </div>
    );
}
