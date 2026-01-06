# Execution Performance Strategy

> **Status:** Authoritative
> **Goal:** Instant feedback loops for learners.
> **Principle:** "Fast feedback > Raw power."

## 1. The Bottlenecks

In a browser-based IDE using WASM, the performance costs come from:

1. **WASM Instantiation:** Loading and compiling the `.wasm` binary (Heavy & Slow).
2. **Worker Startup:** Spawning a new thread (Medium).
3. **Parsing:** Running Ohm-js on large files (Medium).
4. **UI Painting:** Rendering thousands of console lines (Heavy).

---

## 2. Optimization Strategy

We employ a **"Hot Path" Architecture** to minimize these costs during the "Code -> Run -> Tweak -> Run" loop.

### 2.1. Persistent Runtime (The Hot Path)

We do **not** restart the Web Worker or the WASM VM between successful runs.

* **Cold Start (Page Load):**
    1. Spawn Worker.
    2. Fetch & Compile WASM.
    3. Initialize `PumpkinVM`.
  * *Cost:* ~100-500ms (One time).
* **Hot Run (User clicks "Run"):**
    1. Send `EXECUTE` message.
    2. Worker parses + executes.
    3. VM resets its internal state (variables) but stays alive.
  * *Cost:* < 5ms startup.

### 2.2. AST Caching (Smart Re-runs)

Users often click "Run" without changing code, or change only comments.

* **Mechanism:** Middleware in `pumpkin.worker.js`.
* **Logic:**
    1. Compute `sourceHash = sha256(source)`.
    2. If `sourceHash === lastHash` AND `lastAST` exists:
        * **Skip Parsing.**
        * Execute `lastAST` directly.
* **Benefit:** Removes Ohm-js overhead (~10-50ms) on repeated runs.

### 2.3. Output Throttling (UI Protection)

Pre-optimization: `while(true) { show "hi" }` generates 10,000 React renders/sec -> **Crash**.

* **Strategy:** "Frame-Aligned Batching".
* **Implementation:**
  * Worker buffers output messages for 16ms (1 frame).
  * Sends a single `BATCH_STDOUT` message with array of lines.
  * React `useReducer` applies the batch in one commit.
* **Guarantee:** UI never drops below 30FPS, even with infinite execution loops.

### 2.4. Mobile Considerations

Mobile browsers throttle background tabs and workers aggressively.

* **Optimization:** When on mobile User-Agent:
    1. Lower Instruction Limit (e.g., 500k instead of 1M) to save battery.
    2. Disable advanced `Debug Mode` snapshots to save serialization overhead.

---

## 3. Metrics to Watch

We will track these key metrics (via the Privacy-Respecting Telemetry system):

1. **Time to First Output (TTFO):**
    * *Target:* < 100ms.
    * *Measures:* "Does it feel instant?"
2. **Parse vs. Execute Ratio:**
    * If Parse time > Execute time, we need to optimize Ohm or moving parsing to WASM (Rust) in v0.2.
3. **Worker Crash Rate:**
    * Frequent crashes indicate OOM (Out of Memory) or Watchdog failures.

## 4. Implementation Plan

1. **Phase 1 (Now):** Implement Persistent Runtime & UI Throttling.
2. **Phase 2 (v0.2):** Implement AST Caching if telemetry shows parsing is a bottleneck.
3. **Phase 3 (Mobile):** Add device-specific config flags.

This strategy ensures that Pumpkin feels "lightweight" and "snappy" even though it's powering a full compiler toolchain in the browser.
