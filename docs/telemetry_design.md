# IDE Telemetry Design 📊🙈

**Goal:** Improve Pumpkin by knowing *what* fails, false *who* failed.
**Philosophy:** Respect users like contributors. Zero PII (Personally Identifiable Information).

## 1. What We Track (The Metrics)

We use a privacy-friendly provider (e.g., Plausible, PostHog [Anonymous Mode], or simple custom counters).

### A. Usage Counters

* `ide_run_clicked`: Total number of executions.
* `ide_reset_clicked`: How often users start over.
* `example_loaded`: Which examples are most popular? (e.g., `example_id: 'hello_world'`).

### B. Error Aggregation

We track **Error Codes**, not user code.

* `error_triggered`: `{ code: 'E004', type: 'DivisionByZero' }`
  * *Why?* Helps us prioritize which error messages need better hints.
  * *Safety:* We do NOT send the line number or the variable names involved.

### C. Feature Engagement

* `share_link_created`: Are people sharing code?
* `docs_link_clicked`: Are people using the "Explain this" links?

## 2. What We DO NOT Track 🚫

* **Source Code:** We **NEVER** send the user's code to our servers. (Exception: The user explicitly clicks "Share", creating a public link).
* **IP Addresses:** Anonymized or discarded immediately.
* **User IDs:** No cookies tracking users across sessions. Each session is ephemeral.
* **Input Values:** We don't record what you typed into a variable.

## 3. Implementation Strategy

Using a simple custom endpoint or privacy-focused SaaS.

```typescript
// Client-side Telemetry utility
function trackEvent(name: string, props: Record<string, any> = {}) {
  // 1. Check Do-Not-Track headers
  if (navigator.doNotTrack === '1') return;

  // 2. Send anonymous beacon
  navigator.sendBeacon('/api/telemetry', JSON.stringify({
    event: name,
    ...props // strictly filtered props
  }));
}
```

## 4. Privacy Notice Copy 📝

To be displayed in the IDE Footer or "About" modal.

> **Privacy Note:**
> We collect anonymous usage data (like "Run" button clicks and Error types) to improve Pumpkin.
> We **never** record your code, identifiers, or personal data.
> [View Telemetry Policy >]

## 5. Transparency Report

We should eventually publish a public dashboard: "Pumpkin Usage Stats".

* "10,000 runs this week!"
* "Most common error: Missing Semicolon (Fixing in v0.2)".
* *Why?* Proves we are only tracking aggregates.
