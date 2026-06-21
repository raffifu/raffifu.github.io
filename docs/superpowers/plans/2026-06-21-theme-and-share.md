# Theme Switcher and Share Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a theme switcher supporting Light, Dark, Dracula, and Solarized themes, along with a "Copy Link" share button for blog posts.

**Architecture:** Use Bootstrap 5.3's `data-bs-theme` attribute on the `<html>` tag. Store user preference in `localStorage`. Apply custom themes via CSS variables mapped to Bootstrap's core variables. Use native clipboard API for the share button.

**Tech Stack:** HTML/Hugo, Bootstrap 5.3, Vanilla JavaScript, CSS Variables.

---

### Task 1: Setup Bootstrap 5.3 and Theme Initialization Script

**Files:**
- Modify: `layouts/_default/baseof.html`

- [ ] **Step 1: Upgrade Bootstrap links and add initialization script**
Replace the Bootstrap 5.1.3 CSS link with Bootstrap 5.3.3. Add the theme initialization script in the `<head>` just before `</head>`. Update the Bootstrap JS bundle at the bottom of the file to 5.3.3.

Code to apply to `layouts/_default/baseof.html`:
```html
<!-- Replace the old Bootstrap 5.1.3 link / core theme CSS -->
<link href="/css/styles.css" rel="stylesheet" />
<link href="/css/custom.css" rel="stylesheet" />
<!-- Add this inline script right before </head> -->
<script>
  (function() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
  })();
</script>
```

At the bottom of `layouts/_default/baseof.html`, replace the JS bundle:
```html
<!-- Replace Bootstrap 5.1.3 with 5.3.3 -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
```

- [ ] **Step 2: Commit**
```bash
git add layouts/_default/baseof.html
git commit -m "chore: upgrade bootstrap to 5.3.3 and add theme init script"
```

---

### Task 2: Define Custom Themes in CSS

**Files:**
- Modify: `static/css/custom.css`

- [ ] **Step 1: Add Dracula and Solarized color overrides**
Append the CSS variable overrides to the bottom of the file.

```css
/* Custom Themes Overrides for Bootstrap 5.3 */

[data-bs-theme="dracula"] {
  --bs-body-bg: #282a36;
  --bs-body-color: #f8f8f2;
  --bs-link-color: #8be9fd;
  --bs-link-hover-color: #50fa7b;
  --bs-primary: #bd93f9;
  --bs-secondary: #ff79c6;
  --bs-border-color: #44475a;
  --bs-heading-color: #f8f8f2;
}

[data-bs-theme="solarized"] {
  --bs-body-bg: #002b36;
  --bs-body-color: #839496;
  --bs-link-color: #268bd2;
  --bs-link-hover-color: #2aa198;
  --bs-primary: #b58900;
  --bs-secondary: #cb4b16;
  --bs-border-color: #073642;
  --bs-heading-color: #93a1a1;
}
```

- [ ] **Step 2: Commit**
```bash
git add static/css/custom.css
git commit -m "feat: add css variable overrides for dracula and solarized themes"
```

---

### Task 3: Theme Switcher UI and Logic

**Files:**
- Modify: `layouts/partials/header.html`
- Modify: `static/js/scripts.js`

- [ ] **Step 1: Add Dropdown to Navbar**
In `layouts/partials/header.html`, find the `<ul>` inside the `#navbarResponsive` div and append the theme switcher dropdown `<li>`.

Code to insert at the end of the `<ul>`:
```html
<li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="themeDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        <i class="fas fa-palette"></i> Theme
    </a>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="themeDropdown">
        <li><button class="dropdown-item theme-switch" data-theme="light"><i class="fas fa-sun fa-fw me-2"></i>Light</button></li>
        <li><button class="dropdown-item theme-switch" data-theme="dark"><i class="fas fa-moon fa-fw me-2"></i>Dark</button></li>
        <li><button class="dropdown-item theme-switch" data-theme="dracula"><i class="fas fa-vampire fa-fw me-2"></i>Dracula</button></li>
        <li><button class="dropdown-item theme-switch" data-theme="solarized"><i class="fas fa-water fa-fw me-2"></i>Solarized</button></li>
    </ul>
</li>
```

- [ ] **Step 2: Add Switcher Logic**
Append the logic to handle button clicks in `static/js/scripts.js`.

```javascript
window.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher Logic
    const themeSwitches = document.querySelectorAll('.theme-switch');
    themeSwitches.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.documentElement.setAttribute('data-bs-theme', theme);
            localStorage.setItem('theme', theme);
        });
    });
});
```

- [ ] **Step 3: Commit**
```bash
git add layouts/partials/header.html static/js/scripts.js
git commit -m "feat: add theme switcher dropdown and logic"
```

---

### Task 4: Add Share (Copy Link) Button

**Files:**
- Modify: `layouts/_default/single.html`

- [ ] **Step 1: Add Share Button to Single Post**
Insert the share button below the tags logic in `layouts/_default/single.html`.

Code to insert before the `<!-- Highlight.js -->` comment:
```html
    <div class="mt-4 mb-5 text-center">
        <button id="copyLinkBtn" class="btn btn-outline-primary btn-sm">
            <i class="fas fa-link me-2"></i><span id="copyLinkText">Copy Link</span>
        </button>
    </div>

    <script>
        document.getElementById('copyLinkBtn').addEventListener('click', function() {
            navigator.clipboard.writeText(window.location.href).then(function() {
                const textSpan = document.getElementById('copyLinkText');
                const originalText = textSpan.innerText;
                textSpan.innerText = 'Copied!';
                setTimeout(() => {
                    textSpan.innerText = originalText;
                }, 2000);
            });
        });
    </script>
```

- [ ] **Step 2: Commit**
```bash
git add layouts/_default/single.html
git commit -m "feat: add copy link share button to blog posts"
```
