# Security & Abuse Review v0.1 🔒

**Status:** ACCEPTABLE RISK
**Scope:** Browser Playground & CLI

## 1. Identified Risks

### A. Resource Exhaustion (DoS)

* **Infinite Loops:** User writes `while true {}` or `repeat 999999999 {}`.
  * *Result:* The WASM interpreter runs forever. The CPU spikes to 100% on the core running the Worker.
  * *Risk:* Low. Modern browsers throttle background tabs. The UI thread remains responsive (thanks to Web Worker architecture), allowing the user to close the tab.
* **Memory Pressure:** User creates massive strings or many variables.
  * *Result:* Node.js / Browser runs out of memory and crashes the process/tab.
  * *Risk:* Low. With no Arrays/Objects in v0.1, creating GBs of data requires intentionally absurd string concatenation.

### B. Sandbox Escape

* **File System Access:** Can a user read `/etc/passwd`?
  * *Risk:* None. The Pumpkin language has **no** IO primitives for file access. The WASM environment is strictly sandboxed.
* **Network Access:** Can a user fetch a URL?
  * *Risk:* None. No network primitives exist.

## 2. Mitigations (Implemented)

1. **Web Worker Isolation:**
    * Execution happens in a dedicated Worker. An infinite loop **cannot freeze the main UI thread**. The "Stop" button (or at least closing the tab) remains clickable.

2. **WASM Sandbox:**
    * Memory is linear and bounded. Stack overflows or segfaults in Rust generally trap cleanly in WASM, throwing a JavaScript error rather than crashing the browser.

3. **Language Design:**
    * No `file.read`, `http.get`, or foreign function interface (FFI) exposed to the user.

## 3. Explicit Non-Goals (v0.1) 🚫

We explicitly **DO NOT** protect against:

* **Self-DoS:** If a user intentionally writes an infinite loop, their specific runner (Worker/CLI process) will hang until killed. We do not implement "gas limits" or instruction counting yet.
* **Browser Tab Crashes:** If a user consumes 4GB of RAM, the tab crashes. This is acceptable for a client-side toy language.

## 4. Recommendations for v0.2

* **Instruction Limiter:** Implement a "gas metered" interpreter loop to auto-terminate loops after N million instructions.
* **Memory Quota:** Limit the `Environment` HashMap size.

## 5. Summary

Pumpkin v0.1 is safe to host publicly because:

1. It runs entirely client-side (no server risk).
2. It has no capability to touch the system (no IO).
3. The worst-case scenario is the user's own tab getting stuck.
