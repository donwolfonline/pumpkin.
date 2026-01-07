'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CodeEditor } from './CodeEditor';
import { Console } from './Console';
import { Play, RotateCcw } from 'lucide-react';

interface EducationalIDEProps {
    initialCode: string;
    lessonTitle?: string;
}

export function EducationalIDE({ initialCode, lessonTitle }: EducationalIDEProps) {
    const [code, setCode] = useState(initialCode);
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

        return () => clearTimeout(timeoutId);
    }, [code, isRunning]);

    const handleReset = () => {
        setCode(initialCode);
        setOutput([]);
        setError(null);
    };

    return (
        <div className="flex flex-col h-full w-full bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/20 shadow-2xl overflow-hidden">
            {/* Header / Toolbar */}
            <div className="bg-white/10 backdrop-blur-md p-4 md:p-6 flex flex-wrap gap-5 items-center justify-between border-b border-white/10 shrink-0 relative z-20">
                <div className="flex items-center gap-4 bg-white/40 px-5 py-2.5 rounded-full border border-white/40 shadow-sm transition-all hover:bg-white/60">
                    <span className="text-2xl animate-float">🎃</span>
                    <span className="font-crazy font-extrabold text-gray-900 tracking-tight text-base md:text-lg">
                        {lessonTitle || 'Pumpkin IDE'}
                    </span>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-5 py-2.5 font-bold text-sm text-gray-700 bg-white/40 backdrop-blur-md border border-white/40 rounded-full shadow-sm hover:bg-white/60 hover:-translate-y-1 transition-all active:scale-95"
                        title="Reset Code"
                    >
                        <RotateCcw size={18} />
                        <span className="hidden sm:inline">Reset</span>
                    </button>

                    <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`btn btn-primary px-8 py-3 text-base flex items-center gap-3 relative group overflow-hidden ${isRunning ? 'opacity-50' : ''}`}
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            {isRunning ? (
                                <div className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full" />
                            ) : (
                                <Play size={20} fill="currentColor" />
                            )}
                            {isRunning ? 'RUNNING...' : 'RUN CODE'}
                        </span>
                        {!isRunning && <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </button>
                </div>
            </div>

            {/* Split View */}
            <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-gray-50/10">
                {/* Editor Pane */}
                <div className="flex-1 border-b lg:border-b-0 lg:border-r border-white/10 relative min-h-[40vh] lg:min-h-full">
                    <CodeEditor code={code} onChange={setCode} error={error} />
                </div>

                {/* Console Pane */}
                <div className="flex-1 min-h-[30vh] lg:min-h-full bg-burgundy-dark/95 backdrop-blur-xl p-4 md:p-6 overflow-hidden relative">
                    <Console output={output} error={error} />
                    {/* Abstract glow for console */}
                    <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-accent/10 rounded-full blur-3xl pointer-events-none" />
                </div>
            </div>

            {/* Footer */}
            <div className="bg-white/20 backdrop-blur-md border-t border-white/10 p-3 px-6 text-[10px] font-heading font-black text-gray-400 flex justify-between uppercase tracking-widest shrink-0">
                <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-pumpkin-orange rounded-full" />
                    pumpkin v0.1.6
                </span>
                <span className={isRunning ? 'text-green-500 animate-pulse flex items-center gap-2' : 'text-gray-300 flex items-center gap-2'}>
                    <div className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-400'}`} />
                    {isRunning ? 'BUSY' : 'READY'}
                </span>
            </div>
        </div>
    );
}
