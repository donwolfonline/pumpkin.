import { loader } from '@monaco-editor/react';

// Configure Monaco to load from CDN (standard practice for Next.js to avoid widespread webpack issues)
loader.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.44.0/min/vs' } });

export const PUMPKIN_LANGUAGE_ID = 'pumpkin';

export const pumpkinTheme = {
    base: 'vs' as const, // Start with light theme
    inherit: true,
    rules: [
        { token: 'keyword', foreground: 'D97706', fontStyle: 'bold' }, // Amber-600 (Pumpkin Orange)
        { token: 'string', foreground: '15803D' }, // Green-700
        { token: 'number', foreground: 'B45309' }, // Amber-700
        { token: 'comment', foreground: '9CA3AF', fontStyle: 'italic' }, // Gray-400
        { token: 'operator', foreground: '4B5563' }, // Gray-600
        { token: 'identifier', foreground: '111827' }, // Gray-900 (Default text)
    ],
    colors: {
        'editor.foreground': '#111827',
        'editor.background': '#FFFFFF',
        'editorCursor.foreground': '#D97706',
        'editor.lineHighlightBackground': '#FEF3C7', // Amber-100 (Subtle highlight)
        'editorLineNumber.foreground': '#9CA3AF',
        'editor.selectionBackground': '#FDE68A', // Amber-200
    }
};

export const pumpkinConfig = {
    keywords: [
        'show', 'let', 'if', 'else', 'repeat', 'fun', 'return', 'while', 'break', 'true', 'false'
    ],
    operators: [
        '=', '>', '<', '!', ':', '==', '<=', '>=', '!=', 'and', 'or', 'not', '+', '-', '*', '/', '%'
    ],
    tokenizer: {
        root: [
            // Identifiers and keywords
            [/[a-zA-Z_]\w*/, {
                cases: {
                    '@keywords': 'keyword',
                    '@default': 'identifier'
                }
            }],

            // Whitespace
            { include: '@whitespace' },

            // Delimiters and operators
            [/[{}()\[\]]/, '@brackets'],
            [/[<>](?!@symbols)/, '@brackets'],
            [/@symbols/, {
                cases: {
                    '@operators': 'operator',
                    '@default': ''
                }
            }],

            // Numbers
            [/\d*\.\d+([eE][\-+]?\d+)?/, 'number.float'],
            [/\d+/, 'number'],

            // Strings
            [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
            [/"/, { token: 'string.quote', bracket: '@open', next: '@string' }],
        ],

        string: [
            [/[^\\"]+/, 'string'],
            [/\\./, 'string.escape'],
            [/"/, { token: 'string.quote', bracket: '@close', next: '@pop' }]
        ],

        whitespace: [
            [/[ \t\r\n]+/, 'white'],
            [/\/\/.*$/, 'comment'],
        ],
    },
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
};
