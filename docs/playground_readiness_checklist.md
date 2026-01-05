# Playground Readiness Checklist 🎡

**Status:** BLOCKS RELEASE (Partial)
**Goal:** Ensure the Playground is a welcoming "First Impression".

If the Playground feels broken, users will assume the language is broken.

## 1. Performance & Loading 🚀

- [ ] **Cold Start:** Playground loads in < 2 seconds on 4G connection.
- [ ] **WASM Size:** `pumpkin_core_bg.wasm` is gzip compressed (target < 500KB).
- [ ] **Execution Speed:** Simple programs run instantly (no visible delay).
- [ ] **Debouncing:** Typing fast does not cause UI stutter (execution debounced > 500ms).

## 2. Error Recovery 🛡️

- [ ] **Syntax Errors:** Typing `let x =` (incomplete) shows a red squiggle usage, but **does not crash** the page.
- [ ] **Runtime Errors:** `show 1 / 0` prints a red error message in the console, not a browser alert or white screen.
- [ ] **Crash Protection:** If the WASM panics (it shouldn't), the UI detects it and offers a "Restart Playground" button.
- [ ] **Infinite Loops:** `while true {}` eventually times out or the UI remains responsive enough to click "Stop" (if implemented) or reload tab.

## 3. UI/UX Behavior 🎨

- [ ] **Default Code:** Loads with a working "Hello World" example, not empty.
- [ ] **Reset:** "Reset" button restores the default example and clears console.
- [ ] **Mobile:**
  - [ ] Editor is usable on touch screens (no keyboard trap).
  - [ ] "Run" button is visible without scrolling.
  - [ ] Output console does not block the code view.
- [ ] **Console:** Output is selectable and copyable.

## 4. Known Issues (Accepted for v0.1) ⚠️

These are not blockers but should be documented in the README/About page.

- **Mobile Editor:** Code editing on mobile is often clunky (virtual keyboard issues). Accepted if "Run" still works.
- **Infinite Loops:** In v0.1, an infinite loop might freeze the *Worker*. The UI should remain responsive, but "Run" might stay spinning until reload.
- **Syntax Highlighting:** Might be basic keyword coloring only.

## 5. Verification Steps

1. Open Playground in Incognito (Cold Start).
2. Run Default Code -> **Success**.
3. Type `show 1/0` -> **Error displayed safely**.
4. Disconnect Internet -> **App doesn't crash**.
5. Open on Phone -> **Can see code and click Run**.
