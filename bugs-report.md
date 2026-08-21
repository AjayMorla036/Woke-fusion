# Bug Report — Wok Fusion frontend

Findings from a new Playwright e2e suite (`frontend/e2e/`) written against the current codebase, run with `npx playwright test` on `frontend@` commit `ebfbf33` (Vite dev server, Chromium).

**Initial suite result:** 24 passed, 6 failed, 2 `test.fixme()` (documented gaps, not failures — see below).

**Status: all 4 bugs fixed and retested.** After the fixes below, the suite is 30 passed, 0 failed, 2 skipped (the `test.fixme()` gaps, which are missing features rather than regressions — unchanged).

Each failing test asserts what the *correct* behavior should be, so a failure here means a real, reproducible defect — not a flaky test. The suite spans functional, content, navigation, SEO/metadata, and automated accessibility (axe-core) checks.

---

## Bug 1 — Menu prices render with a stray "$" in front of "£"

**Severity:** High (visible on every single menu item, on the core page of the site)
**Area:** `frontend/src/components/FoodCard.jsx:11`
**Failing tests:** `e2e/menu.spec.js` — "every displayed price uses a single, correct currency symbol", "Butter Chicken shows its exact expected price"

### Summary
`FoodCard.jsx` renders `<span className="food-price">${price}</span>`, hardcoding a `$` prefix. But every `price` value passed in from `App.jsx` already includes its own currency symbol (e.g. `"£10.95"`, `"From £8.95"`). The result is every price on the page displaying as `$£10.95` instead of `£10.95`.

### Actual vs expected
- Actual: `$£10.95`
- Expected: `£10.95`

### Impact
Every one of the 23 menu items shows a garbled, unprofessional price on the one page whose entire purpose is to sell food.

### Suggested fix
Remove the hardcoded `$` in `FoodCard.jsx` — render `{price}` directly, since the currency symbol already lives in the data.

### Fix applied
`FoodCard.jsx:11` now renders `{price}` directly with no hardcoded prefix.

---

## Bug 2 — "Contact" nav link points at a section that doesn't exist

**Severity:** Medium (Functional / broken navigation)
**Area:** `frontend/src/App.jsx` (navbar) — no matching `id="contact"` anywhere in the file
**Failing test:** `e2e/navigation.spec.js` — "Contact link points at a section that actually exists on the page"

### Summary
The navbar renders `<a href="#contact">Contact</a>`, but `App.jsx` only defines `id="home"`, `id="menu"`, and `id="story"` — there is no element with `id="contact"`. Clicking "Contact" does nothing.

### Impact
One of the four nav items is dead. A visitor looking for contact info (phone number, hours) has no dedicated section to land on, even though the phone number does exist in the footer and story section.

### Suggested fix
Either add a real `id="contact"` section (address/hours/phone/a contact form), or point the nav link at the footer, or remove the link if contact info is meant to live only in the footer.

### Fix applied
Added `id="contact"` directly to the existing `<footer>` element in `App.jsx`, since it already holds the phone number and branding — no new section needed, just a working anchor to the info that was already there.

---

## Bug 3 — Page title and meta description are still the Vite scaffold defaults

**Severity:** Medium (SEO / professionalism)
**Area:** `frontend/index.html`
**Failing tests:** `e2e/seo-and-meta.spec.js` — "has a branded page title...", "has a meta description mentioning the restaurant"

### Summary
`index.html` still has `<title>frontend</title>` — the default `npm create vite` placeholder — and no `<meta name="description">` tag at all.

### Impact
- The browser tab, bookmark, and search engine result all show "frontend" instead of the restaurant's name.
- Any link preview (WhatsApp, social media, Google search snippet) has no description to show — directly relevant since a WhatsApp-based ordering flow is planned next.

### Suggested fix
Set `<title>Wok Fusion | Indo-Chinese & Sri Lankan Fusion Takeout</title>` (or similar) and add a one-sentence `<meta name="description">`. Cheap fix, meaningful payoff.

### Fix applied
`index.html` now sets `<title>Wok Fusion | Indo-Chinese &amp; Sri Lankan Fusion Takeout</title>` and a `<meta name="description">` describing the restaurant and its takeout-only model.

---

## Bug 4 — Primary CTA button fails WCAG AA color contrast

**Severity:** Medium (Accessibility)
**Area:** `frontend/src/index.css` — `.btn-primary` (`--primary: #FF4500` background, white text)
**Failing test:** `e2e/accessibility.spec.js` — automated axe-core scan ("home page has no critical or serious WCAG violations")

### Summary
The "Explore Menu" hero CTA renders white text (`#f5f5f5`) on the orange `--primary` background (`#f54200` as rendered). Measured contrast ratio is **3.4:1**; WCAG 2 AA requires **4.5:1** for normal-size text. This is the kind of issue that's easy to miss by eye but is exactly what an automated a11y scan (axe-core) is for — that's why it's included as its own test category in this suite.

### Impact
Low-vision users may struggle to read the site's single most important call-to-action button.

### Suggested fix
Darken the button background, or use a darker text color, until contrast reaches ≥4.5:1 — e.g. keep white text but darken `--primary` for button backgrounds specifically (a darker rust/orange still fits the brand), or switch button text to a very dark color like `#1a0a00`.

### Fix applied
`.btn-primary`'s text color changed from `#fff` to `#1a0a00` (a very dark warm brown-black, fitting the theme better than pure black). Verified contrast: **5.21:1** against the base background (`#f54200`) and **6.1:1** against the hover background (`#ff571a`) — both comfortably clear the 4.5:1 AA threshold. `--primary` itself was left untouched since it's reused in ~20 other places (badges, borders, accents) that weren't part of this bug.

---

## Documented gaps (not counted as bugs — `test.fixme()`)

These are missing features, not regressions from previously-correct behavior, so they're marked `test.fixme()` per the project's skip-vs-fixme convention (should exist, currently blocked, acknowledged as coverage debt) rather than reported as bugs:

1. **`e2e/food-card-interaction.spec.js`** — "clicking Add to Order adds the item to a visible cart/order summary." No cart/order state exists anywhere in the app (confirmed: zero `useState` calls in `src/`). This is Phase 2 of the roadmap — the test defines the contract that feature needs to satisfy.
2. **`e2e/responsive.spec.js`** — "there is a way to reach Menu/Story/Contact navigation on mobile." Below the 768px breakpoint, `.nav-links` is hidden via CSS (`display: none`) with no hamburger menu or alternative navigation anywhere in the codebase — confirmed intentional-looking CSS, but currently leaves mobile visitors (the majority of traffic for a takeout site) with no way to navigate except manual scrolling.

---

## What passed (confirms these aren't false positives)

- All 23 food cards render with a name, price, description, and alt text.
- Category structure (8 categories, 10 "Popular" badges) matches the source data exactly.
- Hero, Story, and footer content render correctly, including real business info (founder name, phone number).
- No horizontal overflow at 375/390/414px mobile widths, despite the menu grid's 340px minimum card width — verified empirically rather than assumed.
- Every image has non-empty alt text; exactly one `<h1>`; real `<nav>`/`<footer>` landmarks.
- Favicon is correctly declared.

## Summary table

| # | Bug | Severity | Status |
|---|-----|----------|--------|
| 1 | Prices render as `$£10.95` (stray hardcoded `$`) | High | **Fixed** |
| 2 | "Contact" nav link has no matching section (`#contact` doesn't exist) | Medium | **Fixed** |
| 3 | Page `<title>` and meta description are unbranded Vite defaults | Medium | **Fixed** |
| 4 | Primary CTA button fails WCAG AA color contrast (3.4:1, needs 4.5:1) | Medium | **Fixed** |

## Retest evidence (post-fix)

Retested against the same suite after all four fixes: **30 passed, 0 failed, 2 skipped** (the `test.fixme()` cart and mobile-nav gaps, unchanged and still tracked as future work, not regressions). `npm run lint` and `npm run build` both clean.
