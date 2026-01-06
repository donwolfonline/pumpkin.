# Task: Create Canonical Example Program

- [x] Write First Program End-to-End <!-- id: 160 -->
  - [x] Create `examples/first_program.pumpkin` <!-- id: 161 -->
  - [x] Create `tools/inspect_ast.ts` to visualize AST <!-- id: 162 -->
  - [x] Document flow in `docs/first_program_walkthrough.md` <!-- id: 163 -->
  - [x] Design Pumpkin Standard Library Module System <!-- id: 170 -->
  - [x] Write Pumpkin Language Specification v0.1 <!-- id: 180 -->
  - [x] Create `docs/specification_v0.1.md` <!-- id: 181 -->

- [x] Recruit First Compiler Contributors <!-- id: 190 -->
  - [x] Create `docs/recruitment_plan.md` <!-- id: 191 -->
  - [x] Create `CONTRIBUTING.md` <!-- id: 192 -->
- [x] Define Rust Core Architecture <!-- id: 200 -->
  - [x] Create `docs/rust_core_architecture.md` <!-- id: 201 -->

- [x] Define Canonical Rust AST (Execution AST) <!-- id: 210 -->
  - [x] Create `docs/rust_ast_definition.md` <!-- id: 211 -->

- [x] Fix IDE Execution Hang <!-- id: 1600 -->
  - [x] Resolve "ohm.grammar is not a function" error <!-- id: 1601 -->
  - [x] Implement JS Fallback Interpreter for broken WASM environments <!-- id: 1602 -->
  - [x] Verify AST compatibility for JS and Rust engines <!-- id: 1603 -->
  - [x] Synchronize worker grammar with canonical Ohm file <!-- id: 1604 -->

- [x] Implement Environment & Scope System (Rust) <!-- id: 220 -->
  - [x] Initialize `pumpkin_core` crate <!-- id: 221 -->
  - [x] Implement `src/value.rs` <!-- id: 222 -->
  - [x] Implement `src/env.rs` <!-- id: 223 -->

- [x] Build Core Interpreter Loop (Rust) <!-- id: 230 -->
  - [x] Implement `src/ast.rs` <!-- id: 231 -->
  - [x] Implement `src/interpreter.rs` <!-- id: 232 -->

- [x] Design Rust Error System (Human-First) <!-- id: 240 -->
  - [x] Implement `src/errors.rs` <!-- id: 241 -->

- [x] Rust ↔ TypeScript Boundary (FFI & WASM) <!-- id: 250 -->
  - [x] Create `docs/rust_ts_boundary.md` <!-- id: 251 -->

- [x] Minimal Rust Core Test Suite <!-- id: 260 -->
  - [x] Create `pumpkin_core/tests/integration_tests.rs` <!-- id: 261 -->

- [x] Create Rust Crate (pumpkin-core) <!-- id: 270 -->
  - [x] Create `pumpkin_core/Cargo.toml` <!-- id: 271 -->
  - [x] Create `pumpkin_core/src/lib.rs` <!-- id: 272 -->

- [x] Implement Runtime Values <!-- id: 280 -->
  - [x] Implement `pumpkin_core/src/value.rs` <!-- id: 281 -->

- [x] Implement Environment & Scope System (Rust) <!-- id: 290 -->
  - [x] Refine `pumpkin_core/src/env.rs` with `PumpkinError` <!-- id: 291 -->
  - [x] Create `docs/scope_chain_example.md` <!-- id: 292 -->
- [x] Implement Interpreter (AST Walker) <!-- id: 300 -->
  - [x] Implement `pumpkin_core/src/interpreter.rs` <!-- id: 301 -->
  - [x] Create `docs/interpreter_trace_example.md` <!-- id: 302 -->

- [x] Refine Error System (Strict Specs) <!-- id: 310 -->
  - [x] Refactor `pumpkin_core/src/errors.rs` <!-- id: 311 -->
  - [x] Update usages in `env.rs`, `value.rs`, `interpreter.rs` <!-- id: 312 -->
- [x] Define Public Execution API <!-- id: 320 -->
  - [x] Implement `pumpkin_core/src/lib.rs` with `execute()` <!-- id: 321 -->

- [x] WASM Compatibility Setup <!-- id: 330 -->
  - [x] Update `pumpkin_core/Cargo.toml` <!-- id: 331 -->
  - [x] Create `pumpkin_core/src/wasm.rs` <!-- id: 332 -->
  - [x] Create `docs/wasm_setup.md` <!-- id: 333 -->
- [x] Minimal Test Suite (Spec-Driven) <!-- id: 340 -->
  - [x] Implement `pumpkin_core/tests/integration_tests.rs` with spec mapping <!-- id: 341 -->
- [x] Define Execution Contract (AST → Result) <!-- id: 350 -->
  - [x] Create `docs/execution_contract_v0.1.md` <!-- id: 351 -->
- [x] Node.js ↔ Rust Bridge (CLI Execution) <!-- id: 360 -->
  - [x] Create `docs/node_rust_bridge.md` <!-- id: 361 -->
  - [x] Create `src/cli_bridge.ts` (Mockup) <!-- id: 362 -->

- [x] Pumpkin CLI (User-Facing) <!-- id: 370 -->
  - [x] Create `src/cli/index.ts` (Entry Point) <!-- id: 371 -->
  - [x] Implement `src/cli/run.ts` <!-- id: 372 -->
  - [x] Implement `src/cli/repl.ts` <!-- id: 373 -->

- [x] WASM Export Layer (Rust) <!-- id: 380 -->
  - [x] Refine `pumpkin_core/src/wasm.rs` <!-- id: 381 -->
  - [x] Create `docs/wasm_usage_example.js` <!-- id: 382 -->

- [x] Web Playground Execution Flow <!-- id: 390 -->
  - [x] Create `docs/playground_execution_flow.md` <!-- id: 391 -->

- [x] Unified Output & Error Rendering <!-- id: 400 -->
  - [x] Create `docs/unified_renderer.md` <!-- id: 401 -->
  - [x] Create `src/renderer/` module structure <!-- id: 402 -->

- [x] Distribution & Installation Strategy <!-- id: 410 -->
  - [x] Create `docs/distribution_strategy.md` <!-- id: 411 -->
  - [x] Update `package.json` for npm publishing <!-- id: 412 -->

- [x] End-to-End Smoke Test <!-- id: 420 -->
  - [x] Create `tests/smoke.pumpkin` <!-- id: 421 -->
  - [x] Create `tests/smoke_test.md` (Test Specification) <!-- id: 422 -->
  - [x] Create `tests/run_smoke_test.sh` <!-- id: 423 -->

- [x] Define v0.1 Release Criteria (Gatekeeping) <!-- id: 430 -->
  - [x] Create `docs/release_criteria_v0.1.md` <!-- id: 431 -->

- [x] Final Feature Lock & Scope Freeze <!-- id: 440 -->
  - [x] Create `docs/scope_freeze_v0.1.md` <!-- id: 441 -->

- [x] v0.1 Release Notes (Human-Readable) <!-- id: 450 -->
  - [x] Create `docs/release_notes_v0.1.md` <!-- id: 451 -->

- [x] Installation Verification Matrix <!-- id: 460 -->
  - [x] Create `docs/install_verification_matrix.md` <!-- id: 461 -->

- [x] CLI UX Final Pass <!-- id: 470 -->
  - [x] Create `docs/cli_ux_guidelines.md` <!-- id: 471 -->
  - [x] Update `src/cli/index.ts` with friendly help text <!-- id: 472 -->

- [x] Playground Readiness Checklist <!-- id: 480 -->
  - [x] Create `docs/playground_readiness_checklist.md` <!-- id: 481 -->

- [x] v0.1 Security & Abuse Review (Lightweight) <!-- id: 490 -->
  - [x] Create `docs/security_review_v0.1.md` <!-- id: 491 -->

- [x] Release Day Checklist (Hour-by-Hour) <!-- id: 500 -->
  - [x] Create `docs/release_day_checklist.md` <!-- id: 501 -->

- [x] Post-Release Feedback Triage Plan <!-- id: 510 -->
  - [x] Create `docs/feedback_triage_plan.md` <!-- id: 511 -->

- [x] v0.2 Planning Boundary <!-- id: 520 -->
  - [x] Create `docs/versioning_policy.md` <!-- id: 521 -->

# Phase 2: Website & IDE Implementation 🌍

- [x] Design In-Browser Pumpkin IDE (Core) <!-- id: 600 -->
  - [x] Create `docs/ide_design_v1.md` <!-- id: 601 -->

- [x] Implement In-Browser IDE (Components) <!-- id: 610 -->
  - [x] Add CodeMirror dependencies <!-- id: 611 -->
  - [x] Create `website/components/ide/CodeEditor.tsx` <!-- id: 612 -->
  - [x] Create `website/components/ide/Console.tsx` <!-- id: 613 -->
  - [x] Create `website/components/ide/PumpkinIDE.tsx` <!-- id: 614 -->
  - [x] Implement Web Worker Bridge <!-- id: 615 -->

- [x] IDE UX for Beginners (Critical) <!-- id: 620 -->
  - [x] Create `docs/ide_ux_guidelines.md` <!-- id: 621 -->

- [x] IDE Technical Architecture (Frontend) <!-- id: 630 -->
  - [x] Create `docs/ide_architecture.md` <!-- id: 631 -->

- [x] IDE → Docs Learning Loop <!-- id: 640 -->
  - [x] Create `docs/learning_loop_design.md` <!-- id: 641 -->

- [x] Shareable Playground Links (Design) <!-- id: 650 -->
  - [x] Create `docs/shareable_links_design.md` <!-- id: 651 -->

- [x] "Try These Examples" Panel (Design) <!-- id: 660 -->
  - [x] Create `docs/examples_panel_design.md` <!-- id: 661 -->

- [x] IDE Telemetry (Privacy-Respecting) <!-- id: 670 -->
  - [x] Create `docs/telemetry_design.md` <!-- id: 671 -->

- [x] IDE Roadmap (v0.2+) <!-- id: 680 -->
  - [x] Create `docs/ide_roadmap_future.md` <!-- id: 681 -->

- [ ] Refine Website UI (Footer & Playground) <!-- id: 700 -->
  - [ ] Update Footer (Dynamic Year & GitHub Link) <!-- id: 701 -->
  - [ ] Redesign Playground (Theme & Responsiveness) <!-- id: 702 -->
