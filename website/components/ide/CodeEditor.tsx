
'use client';

import React, { useRef, useEffect } from 'react';
import Editor, { Monaco, OnMount } from '@monaco-editor/react';
import { PUMPKIN_LANGUAGE_ID, pumpkinConfig, pumpkinTheme } from './monaco-config';

// Props
interface CodeEditorProps {
    code: string;
    onChange: (val: string) => void;
    error?: { message: string, line?: number } | null;
}

export function CodeEditor({ code, onChange, error }: CodeEditorProps) {
    const editorRef = useRef<any>(null);
    const monacoRef = useRef<Monaco | null>(null);

    // Register Language and Theme on Mount
    const handleEditorWillMount = (monaco: Monaco) => {
        // Only register if not already done
        if (!monaco.languages.getLanguages().some((l: any) => l.id === PUMPKIN_LANGUAGE_ID)) {
            monaco.languages.register({ id: PUMPKIN_LANGUAGE_ID });
            monaco.languages.setMonarchTokensProvider(PUMPKIN_LANGUAGE_ID, pumpkinConfig as any);
            monaco.editor.defineTheme('pumpkin-theme', pumpkinTheme as any);
        }
    };

    const handleEditorDidMount: OnMount = (editor, monaco) => {
        editorRef.current = editor;
        monacoRef.current = monaco;

        // Ensure theme is applied
        monaco.editor.setTheme('pumpkin-theme');
    };

    // Handle Error Highlighting
    useEffect(() => {
        if (!editorRef.current || !monacoRef.current) return;

        const model = editorRef.current.getModel();
        if (!model) return;

        if (error && error.line) {
            // Add error marker
            monacoRef.current.editor.setModelMarkers(model, 'owner', [
                {
                    startLineNumber: error.line,
                    startColumn: 1,
                    endLineNumber: error.line,
                    endColumn: 1000,
                    message: error.message,
                    severity: monacoRef.current.MarkerSeverity.Error,
                }
            ]);

            // Reveal line
            editorRef.current.revealLineInCenter(error.line);
        } else {
            // Clear markers
            monacoRef.current.editor.setModelMarkers(model, 'owner', []);
        }
    }, [error]);

    return (
        <div className="h-full w-full bg-white relative">
            <Editor
                height="100%"
                defaultLanguage={PUMPKIN_LANGUAGE_ID}
                value={code}
                onChange={(value) => onChange(value || '')}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
                options={{
                    minimap: { enabled: false },
                    fontSize: 16,
                    fontFamily: "'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace",
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    scrollBeyondLastColumn: 0,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    renderLineHighlight: 'all',
                    overviewRulerLanes: 0,
                    overviewRulerBorder: false,
                    hideCursorInOverviewRuler: true,
                    contextmenu: false,

                    // Pumpkin Style
                    cursorBlinking: 'smooth',
                    cursorSmoothCaretAnimation: 'on',
                }}
            />
            {/* Loading Fallback (Basic) */}
            <div className="absolute inset-0 -z-10 bg-white flex items-center justify-center text-gray-400 font-mono text-sm">
                Loading Editor...
            </div>
        </div>
    );
}
