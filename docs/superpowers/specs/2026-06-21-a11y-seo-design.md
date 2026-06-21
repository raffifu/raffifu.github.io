# Accessibility & SEO Design

**Goal:** Improve accessibility and SEO for the Hugo blog `/var/log/raffifu` with minimal, backward-compatible changes.

**Scope:** 7 files modified (hugo.toml, baseof.html, header.html, footer.html, single.html, index.html, list.html, custom.css, scripts.js), 1 file created (robots.txt). No new dependencies.

---

## SEO Changes

### Config (`hugo.toml`)
- Add `description` param for meta description fallback
- Enable built-in Hugo sitemap (`changeFreq`, `priority`)
- TOML key: `[sitemap]`

### `baseof.html`
- Dynamic `lang` attribute from front matter `params.lang`, default `"id"`
- `<link rel="canonical" href="{{ .Permalink }}">`
- `<link rel="alternate" type="application/rss+xml">` for RSS
- `<meta name="robots" content="index, follow">`
- OG tags: `article:published_time`, `article:modified_time`, `article:tag` (for `.IsPage` only)
- Title format: homepage = site title, others = `Title - Site Title`

### `single.html`
- JSON-LD `BlogPosting` schema for all `.Type "post"` pages with: headline, description, author, datePublished, dateModified, keywords, image, url, mainEntityOfPage

### Files created
- `static/robots.txt` — allow all, point to sitemap

---

## Accessibility Changes

### Navigation & Landmarks
- `baseof.html`: `<div id="mainContent">` → `<main id="mainContent">` (proper landmark)
- `baseof.html`: Skip-to-content link as first `<body>` child targeting `#mainContent`
- `header.html`: `aria-current="page"` on active nav links

### Icon-only links
- `footer.html`: `aria-label="Twitter"`, `aria-label="GitHub"`, `aria-label="LinkedIn"` on social icons
- `footer.html`: `rel="noopener noreferrer"` + `target="_blank"` on external links

### Pagination (`index.html`, `list.html`)
- Wrap visible text in `<span aria-hidden="true">`
- Add `<span class="visually-hidden">Previous posts</span>` / `<span class="visually-hidden">Next posts</span>`

### Copy Link (`single.html`)
- Add `role="button"` and `tabindex="0"` to the copy span, plus `aria-label="Copy link"`
- Add live region (`aria-live="polite"`) for announcing "Link copied" to screen readers

### Keyboard & Focus
- `custom.css`: `.skip-link` styles (hidden off-screen, visible on focus)
- `custom.css`: `:focus-visible` outline
- `custom.css`: `.visually-hidden` utility class
- `scripts.js`: Toggle `aria-expanded` on settings panel
- `scripts.js`: Keyboard `Enter`/`Space` handlers for theme-switch elements (already have `role="button"` and `tabindex="0"`)

---

## Files Modified

| File | Changes |
|------|---------|
| `hugo.toml` | Add `description`, `[sitemap]` |
| `layouts/_default/baseof.html` | lang, canonical, RSS alternate, robots meta, OG article tags, skip link, `<main>` landmark |
| `layouts/partials/header.html` | `aria-current` on nav links |
| `layouts/partials/footer.html` | `aria-label`, `rel="noopener noreferrer"`, `target="_blank"` |
| `layouts/_default/single.html` | JSON-LD, better thumbnail alt, `role="button"`, `aria-label`, live region |
| `layouts/index.html` | Pagination visually-hidden text |
| `layouts/_default/list.html` | Pagination visually-hidden text |
| `static/css/custom.css` | `.skip-link`, `:focus-visible`, `.visually-hidden` |
| `static/js/scripts.js` | `aria-expanded` toggle, keyboard handlers |

## Files Created

| File | Purpose |
|------|---------|
| `static/robots.txt` | Allow all, point to sitemap |
