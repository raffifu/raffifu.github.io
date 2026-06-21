# Theme Switcher and Share Button Implementation

## Overview
Implement a theme switcher with Light, Dark (default), Dracula, and Solarized themes, and add a "Copy Link" share button to blog posts.

## 1. Core Setup & Theme Engine
- **Bootstrap Upgrade**: Upgrade Bootstrap links in `layouts/_default/baseof.html` from 5.1.3 to 5.3.3 to enable native CSS variable color modes.
- **Theme Initialization Script**: Add a `<script>` tag inside the `<head>` of `baseof.html` that reads the `theme` key from `localStorage`.
  - Apply the value to the `<html>` tag as `data-bs-theme="<theme-name>"`.
  - If no theme is found in `localStorage`, set the default to `dark`.
  - This inline script executes synchronously before the body renders, preventing theme flickering on page load.

## 2. Custom Themes (CSS)
- Edit `static/css/custom.css` (or `assets/css/custom.css` depending on where it's located) to define the custom themes.
- Create CSS rules for `[data-bs-theme="dracula"]` and `[data-bs-theme="solarized"]`.
- Map specific colors for Dracula (e.g., Background `#282a36`, Text `#f8f8f2`) and Solarized (e.g., Background `#002b36`, Text `#839496`) to standard Bootstrap CSS variables (`--bs-body-bg`, `--bs-body-color`, `--bs-link-color`, `--bs-primary`, etc.).

## 3. Theme Switcher UI
- Edit `layouts/partials/header.html`.
- Add a Bootstrap Dropdown menu in the navbar.
- The dropdown will include buttons for: Light, Dark, Dracula, and Solarized.
- Add an inline script or a script in the site's main JS file to handle click events on these dropdown items:
  - Update the `data-bs-theme` attribute on the `<html>` tag.
  - Save the selected theme to `localStorage`.

## 4. Share Button
- Edit `layouts/_default/single.html`.
- Below the tags section (or alongside it), add a "Copy Link" button using Bootstrap button classes and a FontAwesome clipboard icon.
- Add an `onclick` handler to the button that uses `navigator.clipboard.writeText(window.location.href)`.
- Implement visual feedback (e.g., changing the text to "Copied!" for 2 seconds before reverting) to confirm the action to the user.
