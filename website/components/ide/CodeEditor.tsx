
'use client';

import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { githubLight } from '@uiw/codemirror-theme-github';

// Props
interface CodeEditorProps {
    code: string;
    onChange: (val: string) => void;
}

export function CodeEditor({ code, onChange }: CodeEditorProps) {
    // For now, using JavaScript syntax highlighting as a placeholder for Pumpkin
    // because Lezer grammar is not yet built.
    return (
        <div className="h-full w-full font-mono text-base bg-white">
            <CodeMirror
                value={code}
                height="100%"
                extensions={[javascript()]}
                onChange={(val) => onChange(val)}
                theme={githubLight}
                basicSetup={{
                    lineNumbers: true,
                    foldGutter: false,
                    dropCursor: false,
                    allowMultipleSelections: false,
                    indentOnInput: false,
                }}
                className="h-full"
            />
        </div>
    );
}
