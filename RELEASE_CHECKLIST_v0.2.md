# v0.2 Release Checklist

## Implementation Status

- [x] Bytecode Compiler
- [x] Stack VM
- [x] Module System
- [x] Functions
- [x] Arrays
- [x] Debugger

## Documentation

- [x] Release Notes (`docs/v0.2_release_notes.md`)
- [x] Feature Showcase (`examples/v0_2_showcase.pumpkin`)
- [ ] Language Reference (Update required)

## Quality Assurance

- [ ] Run smoke tests with new VM (`run_smoke_tests.sh`)
- [ ] Verify `wasm-pack` build (Requires environment setup)
- [ ] Validate Debugger Protocol with mock frontend

## Distribution

- [ ] Tag v0.2.0 in git
- [ ] Build release binaries
- [ ] Publish WASM artifacts to npm
