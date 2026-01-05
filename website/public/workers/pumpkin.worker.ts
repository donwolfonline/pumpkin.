
// /public/workers/pumpkin.worker.ts

// Since we don't have the WASM built yet, we will mock the execution for now
// to prove the UI works.
// In the "Build" phase, we will import the real WASM init.

self.onmessage = async (e: MessageEvent) => {
    const { type, source } = e.data;

    if (type !== 'EXECUTE') return;

    // Simulate delay
    await new Promise(r => setTimeout(r, 500));

    // MOCK PARSER & RUNTIME
    // This allows us to verify the UI interaction flow without the Rust build.
    try {
        const output: string[] = [];

        // Very dumb mock interpreter
        const lines = (source as string).split('\n');

        for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('show ')) {
                // Mock "show" output
                const val = trimmed.substring(5).replace(/"/g, '');

                // Handle basic math mock
                if (val.includes('+')) {
                    // super hacky mock eval just for "Hello " + name
                    output.push("Hello Pumpkin");
                } else if (!isNaN(Number(val))) {
                    output.push(val);
                } else if (val === 'count') {
                    // loop mock
                } else {
                    output.push(val);
                }
            }
            if (trimmed.includes('repeat 3')) {
                output.push("1");
                output.push("2");
                output.push("3");
            }
            if (trimmed === 'show 1/0' || trimmed === 'show 1 / 0') {
                throw new Error("Division by Zero");
            }
        }

        self.postMessage({
            type: 'SUCCESS',
            payload: { output }
        });

    } catch (err: any) {
        self.postMessage({
            type: 'ERROR',
            payload: {
                error: err.message || "Unknown Runtime Error",
                line: 1 // Mock line number
            }
        });
    }
};

export { };
