
export default function init() {
    return Promise.resolve();
}

export class PumpkinVM {
    constructor() {
        console.log("Mock PumpkinVM instantiated");
    }
    run(ast) {
        return {
            success: false,
            output: ["WASM not built. This is a placeholder."],
            return_value: null,
            error: null
        };
    }
}
