# Reader Mode Settings Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a floating settings panel in the header allowing users to change theme, font family, and font size.

**Architecture:** Use a custom absolute-positioned `div` disguised as a dropdown that handles settings. Update CSS variables dynamically via JS and persist state to `localStorage`. Prevent click propagation so interactions don't close the panel.

**Tech Stack:** HTML, CSS Variables, Vanilla JS.

---

### Task 1: CSS Setup for Settings and Typography

**Files:**
- Modify: `static/css/custom.css`

- [ ] **Step 1: Add typography CSS variables and panel styles**
Append the new typography CSS variables to the `:root` and `body` rules, and add styles for the custom settings dropdown panel.

In `static/css/custom.css`, update the `body` block and append the new rules at the bottom:
```css
/* Ensure background transitions smoothly and components use the vars */
body {
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  font-family: var(--bs-body-font-family, "Open Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
  font-size: var(--bs-body-font-size, 1rem);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Reader Mode Settings Panel */
.settings-panel {
  display: none;
  position: absolute;
  top: 100%;
  right: 0;
  width: 250px;
  background-color: var(--bs-body-bg);
  border: 1px solid var(--bs-border-color);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  padding: 1rem;
  z-index: 1050;
  text-align: left;
}

.settings-panel.show {
  display: block;
}

.settings-panel hr {
  margin: 0.75rem 0;
}

.settings-panel label {
  font-size: 0.85rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  display: block;
}
```

- [ ] **Step 2: Commit**
```bash
git add static/css/custom.css
git commit -m "feat: add css variables for typography and styling for settings panel"
```

---

### Task 2: HTML Structure for Settings Panel

**Files:**
- Modify: `layouts/partials/header.html`

- [ ] **Step 1: Replace inline theme icons with settings button and panel**
Locate the `<div class="ms-3 ms-md-4 font-monospace">` block containing the theme icons and replace it entirely with the new interactive settings panel HTML.

Replace lines ~35-40:
```html
        <div class="ms-3 ms-md-4 font-monospace">
            <span class="p-1 theme-switch" data-theme="light" style="cursor: pointer;" title="Light"><i class="fas fa-sun"></i></span>
            <span class="p-1 theme-switch" data-theme="dark" style="cursor: pointer;" title="Dark"><i class="fas fa-moon"></i></span>
            <span class="p-1 theme-switch" data-theme="dracula" style="cursor: pointer;" title="Dracula"><i class="fas fa-ghost"></i></span>
            <span class="p-1 theme-switch" data-theme="solarized" style="cursor: pointer;" title="Solarized"><i class="fas fa-water"></i></span>
        </div>
```
With the following structure:
```html
        <div class="ms-3 ms-md-4 font-monospace position-relative" id="settingsDropdownContainer">
            <span id="settingsToggleBtn" class="p-2" style="cursor: pointer;" title="Settings">
                <i class="fas fa-sliders-h"></i>
            </span>
            <div id="settingsPanel" class="settings-panel">
                <div class="mb-3">
                    <label>Theme</label>
                    <div class="d-flex justify-content-between">
                        <span class="p-1 theme-switch" data-theme="light" style="cursor: pointer;" title="Light"><i class="fas fa-sun"></i></span>
                        <span class="p-1 theme-switch" data-theme="dark" style="cursor: pointer;" title="Dark"><i class="fas fa-moon"></i></span>
                        <span class="p-1 theme-switch" data-theme="dracula" style="cursor: pointer;" title="Dracula"><i class="fas fa-ghost"></i></span>
                        <span class="p-1 theme-switch" data-theme="solarized" style="cursor: pointer;" title="Solarized"><i class="fas fa-water"></i></span>
                    </div>
                </div>
                <hr>
                <div class="mb-3">
                    <label for="fontFamilySelect">Font Family</label>
                    <select id="fontFamilySelect" class="form-select form-select-sm" style="background-color: var(--bs-body-bg); color: var(--bs-body-color); border-color: var(--bs-border-color);">
                        <option value="'Open Sans', sans-serif">Sans-serif</option>
                        <option value="'Lora', serif">Serif</option>
                        <option value="'Courier New', Courier, monospace">Monospace</option>
                        <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif">System UI</option>
                    </select>
                </div>
                <hr>
                <div>
                    <label for="fontSizeSlider">Text Size</label>
                    <input type="range" class="form-range" id="fontSizeSlider" min="0.8" max="1.5" step="0.1" value="1.0">
                </div>
            </div>
        </div>
```

- [ ] **Step 2: Commit**
```bash
git add layouts/partials/header.html
git commit -m "feat: replace inline theme switcher with settings panel HTML"
```

---

### Task 3: JavaScript Logic for Initial State

**Files:**
- Modify: `layouts/_default/baseof.html`

- [ ] **Step 1: Update inline initialization script**
Update the script in `<head>` to also read and apply the font family and font size from `localStorage` immediately, preventing FOUC (Flash of Unstyled Content).

Find the `<script>` block inside `<head>` and replace its contents:
```javascript
          (function() {
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-bs-theme', savedTheme);
            
            const savedFont = localStorage.getItem('fontFamily');
            if (savedFont) {
                document.documentElement.style.setProperty('--bs-body-font-family', savedFont);
            }
            
            const savedSize = localStorage.getItem('fontSize');
            if (savedSize) {
                document.documentElement.style.setProperty('--bs-body-font-size', savedSize + 'rem');
            }
          })();
```

- [ ] **Step 2: Commit**
```bash
git add layouts/_default/baseof.html
git commit -m "feat: apply typography preferences immediately on load to prevent FOUC"
```

---

### Task 4: JavaScript Logic for Interactions

**Files:**
- Modify: `static/js/scripts.js`

- [ ] **Step 1: Implement panel toggling and setting updates**
Append the logic for the settings panel, including showing/hiding it and handling the font selectors and slider.

Append to `static/js/scripts.js`:
```javascript
window.addEventListener('DOMContentLoaded', () => {
    // Settings Panel Logic
    const toggleBtn = document.getElementById('settingsToggleBtn');
    const panel = document.getElementById('settingsPanel');
    const container = document.getElementById('settingsDropdownContainer');
    
    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('show');
        });

        // Prevent closing when clicking inside the panel
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close when clicking outside
        document.addEventListener('click', () => {
            panel.classList.remove('show');
        });
    }

    // Typography Logic
    const fontSelect = document.getElementById('fontFamilySelect');
    const sizeSlider = document.getElementById('fontSizeSlider');

    if (fontSelect) {
        const savedFont = localStorage.getItem('fontFamily') || "'Open Sans', sans-serif";
        fontSelect.value = savedFont;
        
        fontSelect.addEventListener('change', (e) => {
            const newFont = e.target.value;
            document.documentElement.style.setProperty('--bs-body-font-family', newFont);
            localStorage.setItem('fontFamily', newFont);
        });
    }

    if (sizeSlider) {
        const savedSize = localStorage.getItem('fontSize') || "1.0";
        sizeSlider.value = savedSize;
        
        sizeSlider.addEventListener('input', (e) => {
            const newSize = e.target.value;
            document.documentElement.style.setProperty('--bs-body-font-size', newSize + 'rem');
            localStorage.setItem('fontSize', newSize);
        });
    }
});
```

- [ ] **Step 2: Commit**
```bash
git add static/js/scripts.js
git commit -m "feat: implement logic for settings panel interactions and persistence"
```
