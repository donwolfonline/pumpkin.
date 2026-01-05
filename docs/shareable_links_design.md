# Shareable Playground Links Design 🔗

**Goal:** Infinite code sharing with zero database cost.
**Mechanism:** Client-side URL encoding (LZ-compression).

## 1. URL Schema

We will use a query parameter or hash fragment to store the code. Hash fragments are often preferred as they don't send the code to the server (privacy-friendly) and don't trigger server-side 414 errors as easily.

**Format:**
`https://pumpkin-lang.org/playground#code=[COMPRESSED_STRING]`

**Why Hash (`#`)?**

* **Privacy:** The code is never sent to the server in the HTTP request.
* **Capacity:** Browsers allow very long hash fragments (often much larger than query params).
* **State:** It feels like "client-side state".

## 2. Encoding Strategy

Raw text is too wasteful. Base64 is okay but grows by 33%.
We will use **LZ-based compression** (specifically `lz-string`) to shrink the code before encoding.

**Flow:**

1. **Input:** `let x = 10`
2. **Compress:** `lz-string.compressToEncodedURIComponent(input)`
3. **Result:** `N4IgzgLghgTg9gO2DA...`
4. **URL:** `...#code=N4Igzg...`

**Decompression:**

1. Read `#code` param.
2. `lz-string.decompressFromEncodedURIComponent(param)`
3. Load into Editor.

## 3. Limit & Fallbacks

* **Soft Limit:** 2,000 characters (URL safe across almost all legacy tools).
* **Hard Limit:** ~30,000 characters (Modern browser limit).
* **UX:** If code > limit, disable "Share" button and show tooltip: "Code is too long to share via URL."

## 4. UX Flow

### A. The "Share" Button

* **Location:** Top right of IDE (Icon: 🔗).
* **Action:** Click.
* **Effect:**
    1. Compress code.
    2. Update browser URL (without reload).
    3. Copy URL to Clipboard.
    4. Show Toast: "✨ Link copied to clipboard!"

### B. Loading a Shared Link

* **Scenario:** User visits `...#code=XYZ`
* **Action:**
    1. Parse URL.
    2. Decompress code.
    3. If successful: Replace "Hello World" default with Shared Code.
    4. If failed (corrupt): Show error toast "❌ Invalid shared link. Loading default.", load Hello World.

## 5. Security Considerations 🛡️

* **XSS:** No risk of typical XSS because we put the content into the *Editor*, not `innerHTML`.
* **Phishing:** A user could write a program that `show`s "Please send your password to...".
  * *Mitigation:* The domain is `pumpkin-lang.org`. We can add a "Shared Code" badge/banner ("You are viewing shared code") to alert the user it's not official content. (Optional for v1).

## 6. Implementation Plan

1. **Dependencies:** `npm install lz-string`
2. **Utility:** Create `src/lib/share.ts` with `encode(code)` and `decode(hash)`.
3. **Component:** Add Share button to `PumpkinIDE.tsx`.
4. **Hook:** `useUrlState` to read hash on mount.
