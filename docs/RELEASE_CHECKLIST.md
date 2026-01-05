# Pumpkin Release Checklist

## 1. Pre-Release Verification

- [ ] Build succeeds clean: `npm run build`
- [ ] Tests pass (manual verification via CLI)
- [ ] `package.json` version is updated
- [ ] `bin` entry points to correct file (`dist/src/cli.js`)
- [ ] `pumpkin.ohm` is copied to `dist/src/`

## 2. Installation Test (Local)

- [ ] Run `npm install -g .` in project root
- [ ] Verify command `pumpkin` works in terminal
- [ ] Run `pumpkin run examples/daily_routine.pumpkin`
- [ ] Uninstall: `npm uninstall -g pumpkin-lang`

## 3. Publishing to NPM

- [ ] Login: `npm login`
- [ ] Publish: `npm publish --access public`
- [ ] Verify page on npmjs.com

## 4. Post-Release

- [ ] Create git tag: `git tag v1.0.0`
- [ ] Push tag: `git push origin v1.0.0`
- [ ] Update documentation/website
