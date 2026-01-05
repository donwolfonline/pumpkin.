# Post-Release Feedback Triage Plan 🕵️‍♂️

**Goal:** Minimize noise, maximize stability.
**Philosophy:** Not all feedback is equal. We prioritize **bugs** over **features**.

## 1. Issue Labeling Strategy

All incoming GitHub issues must be categorized immediately.

| Label | Meaning | Action |
| :--- | :--- | :--- |
| `🐛 bug` | Something that *should* work is broken. | **Prioritize.** |
| `✨ feature` | New functionality request. | **Defer.** |
| `📚 documentation` | Typos, confusion, missing guides. | **Accept.** |
| `💥 critical` | Crash, panic, or security issue. | **Fix Immediately.** |
| `🧊 v0.2-scope` | Good idea, but not for now. | **Tag & Close.** |
| `🚫 wont-fix` | Out of alignment with Pumpkin's philosophy. | **Close.** |

## 2. Prioritization Logic

We process issues in this order:

1. **Release Blockers:** "Installation fails", "Playground won't load".
2. **Safety Valves:** "Rust core panicked", "Browser froze".
3. **Correctness:** "1 + 1 = 3".
4. **UX/Docs:** "Error message is confusing".
5. **Everything Else:** Features, Syntax changes, Optimizations.

## 3. The "Ignore" List (What we say No to)

For v0.1, we explicitly **do not accepting** PRs or keeping issues open for:

* Adding Functions / Arrays / Structs (Scope Creep).
* Changing syntax (e.g. "Use brackets instead of braces").
* Performance optimizations (unless we are freezing the browser).
* Adding standard library features (Math, File I/O).

**Why?** Because v0.1 needs to stabilize first. We cannot build the second floor while the foundation is wet.

## 4. Response Templates

### A. The "Good Bug"
>
> "Thanks for the report! 🎃 This looks like a legitimate bug in our implementation. I've labeled it `bug` and added it to the v0.1.1 milestone. PRs welcome if you'd like to tackle it!"

### B. The "Feature Request" (Deferred)
>
> "This is a great idea! However, we are strictly freezing the v0.1 feature set to ensure stability. I've added the `v0.2-scope` label. We will revisit this when planning v0.2. Thanks for exploring Pumpkin!"

### C. The "Not Aligned" (Wont Fix)
>
> "Thanks for the suggestion. Pumpkin is designed specifically for education and simplicity, so we are avoiding [feature] intentionally to keep the language small. We appreciate the feedback!"

### D. The "Panic" (Critical)
>
> "🚨 Whoa, the interpreter shouldn't panic! Thanks for finding this. This is a top priority. We are investigating immediately."

## 5. Triage Team Roster

* **Triage Captain:** @maintainer (You)
  * *Duty:* Label every new issue within 24h.
  * *Duty:* Close invalid issues aggressively but politely.

## 6. Workflow

1. User opens issue.
2. Maintainer reads.
3. **Label Applied.**
4. If `bug` -> Assign to milestone.
5. If `feature` -> Reply with Template B -> Close (or keep open if actively planning v0.2).
6. If `question` -> Answer -> Close.
