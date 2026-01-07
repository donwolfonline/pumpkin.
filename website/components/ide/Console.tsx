
'use client';

import React, { useEffect, useRef } from 'react';

interface ConsoleProps {
    output: string[];
    error: { message: string; line?: number } | null;
}

export function Console({ output, error }: ConsoleProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom on new output
    useEffect(() => {
        if (output.length === 0 && !error) return;
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [output, error]);

    return (
        <div className="bg-gray-50 text-gray-800 font-mono p-4 rounded-lg h-full overflow-y-auto shadow-inner text-sm leading-relaxed border border-gray-200">
            <div className="text-gray-500 mb-2 select-none border-b border-gray-200 pb-1">
                pumpkin-cli v0.1.7-web
            </div>

            {/* Standard Output */}
            {output.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap break-all">
                    <span className="text-gray-500 mr-2">{'>'}</span>
                    {line}
                </div>
            ))}

            {/* Error Output */}
            {error && (
                <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-red-900">
                    <div className="flex items-center gap-2 font-bold text-red-700 mb-1">
                        <span>❌ Interpretation Error</span>
                        {error.line && <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Line {error.line}</span>}
                    </div>
                    <div className="whitespace-pre-wrap">{error.message}</div>
                </div>
            )}

            {/* Empty State Hint */}
            {output.length === 0 && !error && (
                <div className="text-gray-600 italic mt-4">
                    Ready to run...
                </div>
            )}

            <div ref={bottomRef} />
        </div>
    );
}
