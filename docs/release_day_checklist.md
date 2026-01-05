# Release Day Checklist v0.1 🗓️

**Objective:** A boring, predictable release.
**Owners:** @maintainer (You)
**Communication:** Discord / GitHub

## T-Minus 24 Hours: The Code Freeze 🥶

- [ ] **Code Freeze:** No new commits to `main` except critical fixes.
- [ ] **CI Check:** Ensure GitHub Actions are passing (Green).
- [ ] **Docs Check:** Read `docs/release_notes_v0.1.md` one last time for typos.
- [ ] **Dry Run:** Run `./tests/run_smoke_test.sh` locally.

## T-Minus 1 Hour: Pre-Flight Checks 🛫

- [ ] **Environment:** Ensure you have `npm` and `cargo` access.
- [ ] **Clean Slate:** `git clean -fdx` && `npm install` && `npm run prebuild`.
- [ ] **Smoke Test:** Run `./tests/run_smoke_test.sh`. **MUST PASS.**
- [ ] **Manual Playground Check:** Open local website, run "Hello World".
- [ ] **Version Bump:** Edit `package.json` and `Cargo.toml` to `0.1.0`. Commit "chore: bump version to 0.1.0".

## T=0: The Launch 🚀

- [ ] **Tag:** `git tag v0.1.0` && `git push origin v0.1.0`.
- [ ] **Build:** `npm run build` (Ensures final artifacts).
- [ ] **Publish NPM:** `npm publish` (Public access enabled).
- [ ] **Verify Install:**

    ```bash
    # In a new terminal tab
    npm install -g pumpkin-lang
    pumpkin version # Should be 0.1.0
    pumpkin run tests/smoke.pumpkin # Should pass
    ```

- [ ] **Deploy Website:** Push to production branch (e.g., Vercel/Netlify auto-deploy).
- [ ] **Verify Playground:** Visit public URL, run "Hello World".

## T+15 Mins: The Announcement 📣

- [ ] **GitHub Release:** Draft new release from tag `v0.1.0`. Paste `docs/release_notes_v0.1.md` content. Attach binaries if available. Publish.
- [ ] **Socials:** Post announcements (Twitter, Discord, Reddit).
    > "Pumpkin v0.1 is live! 🎃 Try the playground: <https://pumpkin-lang.org>"

## T+1 Hour: Monitoring 📉

- [ ] **Check Issues:** Monitor GitHub for "Installation Failed" reports.
- [ ] **Check Discord:** Listen for playground crashes.
- [ ] **Breathe:** You did it.

## 🚨 Rollback Plan (In case of fire)

**Scenario A: npm package is broken (install fails)**

1. run `npm unpublish pumpkin-lang@0.1.0`.
2. Delete GitHub Release `v0.1.0`.
3. Delete git tag `v0.1.0`.
4. Fix issue.
5. Wait 24h (npm rule) OR bump version to `v0.1.1` immediately and retry.

**Scenario B: Playground is broken**

1. Revert website deployment to previous commit.
2. Leaves CLI available but hides broken web UI.

**Scenario C: Critical Bug found (e.g. infinite loop crashes browser)**

1. Do NOT rollback.
2. Update Release Notes with "Known Issue" warning.
3. Fix in `v0.1.1` asap.
