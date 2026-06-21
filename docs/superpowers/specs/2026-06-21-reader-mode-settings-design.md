# Reader Mode Settings Panel Design Spec

## Overview
Replace the inline theme switcher with a floating "Reader Mode" style settings dropdown. This panel will allow the user to change the site's theme, font family, and font size, with all preferences saved to `localStorage`.

## 1. UI Components
### Header Button
- Replace the inline theme icons (`.theme-switch`) in `layouts/partials/header.html` with a single "Settings" button.
- Use a gear or slider icon (e.g., `fas fa-sliders-h`).

### Floating Panel (Dropdown)
- A custom `div` positioned absolutely (dropdown style) below the settings button.
- Must prevent closing when clicking inside it (using `stopPropagation` on click events inside the panel).
- **Sections:**
  - **Theme:** Four buttons (Light, Dark, Dracula, Solarized) grouped together.
  - **Font Family:** A `<select>` element containing:
    - `sans-serif` (Open Sans / System Default)
    - `serif` (Lora / System Serif)
    - `monospace` (System Monospace)
    - `system-ui` (Inter / Roboto / San Francisco)
  - **Font Size:** An `<input type="range">` slider. Range: `0.8` to `1.5` (representing `rem` or multiplier), step `0.1`.

## 2. CSS & Variables
- Define CSS custom properties for font family and size on the `:root` or `html` tag.
  - `--bs-body-font-family` (to override Bootstrap's default).
  - `--bs-body-font-size` (applied to `body` or `html`).
- Provide CSS for the custom floating panel to look polished (borders, background adapting to themes, padding, shadows).

## 3. JavaScript Logic
- Update `static/js/scripts.js` (and the inline initialization script in `baseof.html`) to handle the new state.
- **Initialization:** Read `theme`, `fontFamily`, and `fontSize` from `localStorage` before render to prevent FOUC.
- **Event Listeners:**
  - Slider `input` event updates the `--bs-body-font-size` CSS variable instantly.
  - Select `change` event updates the `--bs-body-font-family` CSS variable.
  - Theme buttons update the `data-bs-theme` attribute.
  - All changes update `localStorage` accordingly.
- Ensure clicking outside the floating panel closes it.