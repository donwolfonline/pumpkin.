
import React from 'react';
import { PumpkinIDE } from '../../components/ide/PumpkinIDE';

export const metadata = {
    title: 'Playground | Pumpkin',
    description: 'Write and run Pumpkin code in your browser.',
};

export default function PlaygroundPage() {
    return (
        <div className="min-h-screen bg-amber-50 flex flex-col items-center justify-center p-4 md:p-8">
            <div className="mb-6 text-center">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                    Try Pumpkin 🎃
                </h1>
                <p className="text-gray-600 max-w-lg mx-auto">
                    A friendly, zero-setup playground. Runs entirely in your browser.
                </p>
            </div>

            <PumpkinIDE />

            <div className="mt-8 text-center text-sm text-gray-400">
                <p>
                    Pumpkin v0.1.0 • <a href="/" className="underline hover:text-gray-600">Back to Home</a>
                </p>
            </div>
        </div>
    );
}
