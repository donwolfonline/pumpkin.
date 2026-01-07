---
description: How to publish the Pumpkin VS Code extension to the Marketplace
---

# Publishing to VS Code Marketplace

Follow these steps to officially release the Pumpkin extension.

## 1. Create a Publisher Account

1. Go to the [Visual Studio Marketplace Management Portal](https://marketplace.visualstudio.com/manage).
2. Sign in with a Microsoft account.
3. Create a new publisher. Use the name `citrullix` (as defined in `package.json`).

## 2. Get a Personal Access Token (PAT)

1. Go to [Azure DevOps](https://dev.azure.com/).
2. Click **User Settings** (cog icon) -> **Personal Access Tokens**.
3. Create a **New Token**.
4. Set **Organization** to `All accessible organizations`.
5. Set **Scopes** to `Custom defined`.
6. Find **Marketplace** and check `Publish`.
7. **Copy the token immediately** (it won't be shown again).

## 3. Login and Publish

Run these commands inside the `editor/vscode` directory:

// turbo

```bash
# Login to your publisher (you will be asked for the PAT)
npx @vscode/vsce login citrullix

# Publish the extension
npx @vscode/vsce publish
```

## 4. Maintenance

To push updates in the future, simply update the `version` in `package.json` and run:

```bash
npx @vscode/vsce publish
```
