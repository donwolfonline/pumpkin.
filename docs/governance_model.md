# Pumpkin Community Governance Model

## Mission

**Pumpkin is a community-driven language where contributions are welcomed, decisions are transparent, and stability is paramount.**

---

## 1. Governance Structure

### 1.1 Roles and Responsibilities

```
┌─────────────────────────────────────┐
│         Core Team (3-5)             │  Final authority
│  - Language spec                    │
│  - Breaking changes                 │
│  - Releases                         │
└─────────────────────────────────────┘
              ↓ delegates to
┌─────────────────────────────────────┐
│       Component Maintainers         │  Domain authority
│  - Compiler                         │
│  - VM                               │
│  - Standard Library                 │
│  - Tooling                          │
└─────────────────────────────────────┘
              ↓ reviews
┌─────────────────────────────────────┐
│        Contributors                 │  Submit PRs
└─────────────────────────────────────┘
```

---

### 1.2 Core Team

**Responsibilities:**

- Approve RFCs for language changes
- Approve breaking changes
- Cut releases (major, minor, patch)
- Resolve disputes
- Set project direction

**Selection**: Invited by existing core team (meritocratic)

**Term**: Indefinite (can step down)

---

### 1.3 Component Maintainers

**Compiler Maintainer**: `pumpkin_core/src/compiler.rs`  
**VM Maintainer**: `pumpkin_core/src/vm.rs`  
**Stdlib Maintainer**: `stdlib/`  
**Tooling Maintainer**: CLI, debugger, LSP

**Responsibilities:**

- Review PRs in their domain
- Approve non-breaking changes
- Escalate breaking changes to core team
- Mentor contributors

**Selection**: Nominated by core team based on contributions

---

### 1.4 Contributors

**Anyone** can contribute:

- Bug fixes
- Documentation
- New features (with RFC approval)
- Examples
- Tests

**No permission required** for:

- Opening issues
- Commenting on RFCs
- Submitting PRs (subject to review)

---

## 2. Contribution Model

### 2.1 Contribution Types

| Area | Examples | Approver |
|------|----------|----------|
| **Compiler** | Parser, typechecker, codegen | Compiler maintainer |
| **VM** | Bytecode execution, GC | VM maintainer |
| **Stdlib** | `math.*`, `string.*` | Stdlib maintainer |
| **Tooling** | CLI, debugger, formatter | Tooling maintainer |
| **Docs** | Guides, API docs | Any maintainer |
| **Tests** | Unit, integration | Original component maintainer |

---

### 2.2 Pull Request Workflow

```
1. Fork repo
     ↓
2. Create branch (fix/feature-name)
     ↓
3. Make changes + tests + docs
     ↓
4. Open PR
     ↓
5. CI checks (tests, lints, formatting)
     ↓
6. Maintainer review
     ↓ (if changes requested)
7. Address feedback
     ↓
8. Approval + merge
```

**Requirements for Merge**:

- ✅ All CI checks pass
- ✅ Tests added (for new features/bug fixes)
- ✅ Documentation updated
- ✅ 1+ maintainer approval
- ✅ No unresolved review comments

---

### 2.3 Commit Message Standards

```
feat(compiler): add support for optional types

- Extend AST with TypeAnnotation nodes
- Implement type checking in compiler
- Add runtime type validation in VM

Closes #123
```

**Format**: `<type>(<scope>): <subject>`

**Types**: `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `chore`

---

## 3. RFC and Proposal Workflow

### 3.1 When RFC is Required

**Required**:

- New language features (syntax, semantics)
- Breaking changes to stable APIs
- Major architectural changes

**Not Required**:

- Bug fixes
- Performance improvements
- Documentation
- Internal refactoring

---

### 3.2 RFC Lifecycle

```
Draft
  ↓
Community Discussion (2 weeks min)
  ↓
Revisions
  ↓
Core Team Review
  ↓
Accepted / Rejected
  ↓ (if accepted)
Implementation
  ↓
Stabilization
```

---

### 3.3 RFC Template

**File**: `docs/rfcs/NNNN-feature-name.md`

```markdown
# RFC NNNN: Feature Name

## Summary
One-paragraph explanation.

## Motivation
Why is this needed? What problem does it solve?

## Guide-level explanation
Explain as if teaching it to a Pumpkin user.

## Reference-level explanation
Precise technical details.

## Drawbacks
Why *not* do this?

## Rationale and alternatives
Why is this design the best?

## Prior art
What do other languages do?

## Unresolved questions
What's still unclear?

## Future possibilities
What could this enable later?
```

---

### 3.4 RFC Decision Process

1. **Community Discussion**: At least 2 weeks, gather feedback
2. **Core Team Review**: Weekly meeting, discuss concerns
3. **Vote**: Simple majority (3/5)
4. **Acceptance Criteria**:
   - Clear benefit to users
   - Implementation feasible
   - Aligns with language philosophy
   - No fundamental objections

---

## 4. Decision-Making Rules

### 4.1 Authority Levels

**Level 1: Maintainer Approval** (No RFC)

- Bug fixes
- Performance improvements
- Documentation improvements
- Test additions

**Level 2: Core Team Approval** (RFC Required)

- New language features
- Breaking changes
- API changes

**Level 3: Community Consensus** (Major Decisions)

- Changing governance model
- Code of conduct amendments
- License changes

---

### 4.2 Conflict Resolution

**Disagreement on PR**:

1. Discuss in PR comments
2. If unresolved, escalate to component maintainer
3. If still unresolved, escalate to core team
4. Core team decision is final

**Disagreement on RFC**:

1. 2-week discussion period
2. Core team mediates
3. Vote if needed (simple majority)

---

## 5. Package Manager Governance

### 5.1 Package Registry Ownership

**Centralized Registry**: `packages.pumpkin-lang.org`

**Operated by**: Core team (funds from sponsors)

**Package Ownership**:

- Authors own their packages
- Can transfer ownership
- Can add co-maintainers

---

### 5.2 Package Quality Standards

**To publish to registry**:

- ✅ Valid `pumpkin.toml`
- ✅ No malicious code (automated scans)
- ✅ License declared
- ✅ README.md exists

**Not required but encouraged**:

- Tests
- Documentation
- Examples

---

### 5.3 Package Moderation

**Grounds for removal**:

- Malware
- Spam
- Trademark violation
- DMCA takedown (with verification)

**Process**:

1. Report filed (GitHub issue or email)
2. Core team investigates
3. Package suspended pending review
4. Decision within 7 days
5. Appeal allowed (30 days)

---

## 6. Contributor Onboarding Paths

### 6.1 First Contribution Journey

**Week 1**: Pick a "good first issue"  
**Week 2**: Submit PR, get review feedback  
**Week 3**: Make revisions, get merged  
**Week 4**: Pick second issue (slightly harder)

**After 5+ merged PRs**: Eligible for "Contributor" badge  
**After 20+ merged PRs**: Nominated for component maintainer

---

### 6.2 Mentorship Program

**For new contributors**:

- Assigned mentor (existing maintainer)
- 1-on-1 help with first PR
- Code review with explanations
- Weekly office hours (Discord)

**Mentor Responsibilities**:

- Answer questions
- Provide constructive feedback
- Suggest next issues

---

### 6.3 Learning Resources

**Documentation**:

- `CONTRIBUTING.md` - How to contribute
- `ARCHITECTURE.md` - Codebase structure
- `docs/compiler_internals.md` - How the compiler works

**Videos**:

- "Pumpkin Codebase Walkthrough" (YouTube)
- "How to Submit Your First PR"

---

## 7. Good First Issues (First 10)

### Issue #1: Add `math.sign()` to stdlib

**Description**: Implement `sign(n)` returning -1, 0, or 1  
**Files**: `stdlib/math.rs`  
**Difficulty**: Easy  
**Estimated Time**: 2 hours

---

### Issue #2: Improve error message for division by zero

**Description**: Add hint suggesting checking if divisor is zero  
**Files**: `pumpkin_core/src/vm.rs`  
**Difficulty**: Easy  
**Estimated Time**: 1 hour

---

### Issue #3: Add example: Bubble Sort

**Description**: Write `examples/bubble_sort.pumpkin`  
**Files**: New file  
**Difficulty**: Easy  
**Estimated Time**: 1 hour

---

### Issue #4: Fix typo in Language Reference

**Description**: "funtion" → "function" in docs  
**Files**: `docs/Language_Reference_v0.1.md`  
**Difficulty**: Trivial  
**Estimated Time**: 5 minutes

---

### Issue #5: Add test for array bounds checking

**Description**: Ensure out-of-bounds access throws error  
**Files**: `pumpkin_core/tests/arrays.rs`  
**Difficulty**: Easy  
**Estimated Time**: 30 minutes

---

### Issue #6: Add `string.repeat()` to stdlib

**Description**: Repeat a string N times  
**Files**: `stdlib/string.rs`  
**Difficulty**: Easy  
**Estimated Time**: 1.5 hours

---

### Issue #7: Add CLI flag `--version`

**Description**: Print Pumpkin version and exit  
**Files**: `src/cli.rs`  
**Difficulty**: Easy  
**Estimated Time**: 30 minutes

---

### Issue #8: Document `while` loop in Language Reference

**Description**: Add examples of while loops  
**Files**: `docs/Language_Reference_v0.1.md`  
**Difficulty**: Easy  
**Estimated Time**: 1 hour

---

### Issue #9: Add benchmark: Fibonacci

**Description**: Benchmark fib(30) execution time  
**Files**: `benches/fibonacci.rs`  
**Difficulty**: Medium  
**Estimated Time**: 2 hours

---

### Issue #10: Implement `array.sum()` in stdlib

**Description**: Sum all numbers in an array  
**Files**: `stdlib/array.rs`  
**Difficulty**: Easy  
**Estimated Time**: 2 hours

---

## 8. Tooling for Community

### 8.1 GitHub Labels

**Priority**:

- `P0: Critical` - Security, crashes
- `P1: High` - Major bugs
- `P2: Medium` - Minor bugs, features
- `P3: Low` - Nice-to-have

**Type**:

- `T: Bug`
- `T: Feature`
- `T: Docs`
- `T: Performance`

**Status**:

- `S: Needs Triage`
- `S: Needs RFC`
- `S: Ready for PR`
- `S: In Progress`

**Difficulty**:

- `D: Good First Issue`
- `D: Easy`
- `D: Medium`
- `D: Hard`

---

### 8.2 Automation

**GitHub Actions**:

- ✅ Run tests on every PR
- ✅ Check formatting (`cargo fmt`)
- ✅ Run clippy lints
- ✅ Build docs
- ✅ Label PRs by files changed

**Bors Bot**:

- Merge queue (prevent build breakage)
- Auto-merge when approved + CI passes

---

### 8.3 Communication Channels

**GitHub Discussions**: Design discussions, Q&A  
**Discord**: Real-time chat, office hours  
**Twitter**: Announcements  
**Blog**: Release notes, deep dives

---

## 9. Stability and Backward Compatibility

### 9.1 Versioning Policy (Semantic Versioning)

**MAJOR.MINOR.PATCH** (e.g., 1.2.3)

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

**Example**:

- `0.3.0` → `0.4.0`: New stdlib functions (backward compatible)
- `0.4.0` → `1.0.0`: Gradual types stabilized (major milestone)
- `1.0.0` → `2.0.0`: Syntax change (breaking)

---

### 9.2 Deprecation Policy

**Minimum 2 minor versions** before removal.

**Process**:

1. Mark as deprecated (add warning)
2. Update docs with migration guide
3. Wait 2 releases
4. Remove in next major

**Example**:

```rust
#[deprecated(since = "1.2.0", note = "Use `execute` instead")]
pub fn run(&mut self, source: &str) -> Result<(), PumpkinError> {
    self.execute(source)
}
```

- v1.2: Deprecated
- v1.3-1.9: Still works
- v2.0: Removed

---

## 10. Funding and Sustainability

### 10.1 Funding Sources

- **GitHub Sponsors**: Individual and corporate
- **OpenCollective**: Transparent finances
- **Grants**: Academic/research grants

**Funds Used For**:

- Package registry hosting
- CI/CD infrastructure
- Contributor stipends (future)
- Conference travel

---

### 10.2 Financial Transparency

**Monthly Reports**: Published on OpenCollective  
**Budget**: Reviewed quarterly by core team

---

## Summary

Pumpkin's governance balances **community participation** with **stable leadership**:

1. **Open Contributions**: Anyone can submit PRs
2. **Clear Authority**: Core team for language, maintainers for components
3. **RFC Process**: Transparent decision-making
4. **Quality Standards**: Tests, docs, code review
5. **Onboarding**: Mentorship and good first issues

The goal is a **sustainable, welcoming community** that builds a stable language together.
