/*!
* Start Bootstrap - Clean Blog v6.0.8 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
    
    if (!mainNav) return;
    
    const headerHeight = mainNav.clientHeight;
    window.addEventListener('scroll', function() {
        const currentTop = document.body.getBoundingClientRect().top * -1;
        if ( currentTop < scrollPos) {
            // Scrolling Up
            if (currentTop > 0 && mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-visible');
            } else {
                console.log(123);
                mainNav.classList.remove('is-visible', 'is-fixed');
            }
        } else {
            // Scrolling Down
            mainNav.classList.remove(['is-visible']);
            if (currentTop > headerHeight && !mainNav.classList.contains('is-fixed')) {
                mainNav.classList.add('is-fixed');
            }
        }
        scrollPos = currentTop;
    });
})


window.addEventListener('DOMContentLoaded', () => {
    // Auto-generate captions for markdown images
    const contentImages = document.querySelectorAll('article p img, main p img');
    contentImages.forEach(img => {
        if (img.alt && img.alt.trim() !== '') {
            const figure = document.createElement('figure');
            figure.className = 'text-center mt-4 mb-4';
            
            const parent = img.parentNode;
            if (parent.tagName === 'P' && parent.childNodes.length === 1) {
                parent.parentNode.insertBefore(figure, parent);
                figure.appendChild(img);
                parent.remove();
            } else {
                parent.insertBefore(figure, img);
                figure.appendChild(img);
            }
            
            img.classList.add('img-fluid', 'rounded');
            
            const figcaption = document.createElement('figcaption');
            figcaption.className = 'figure-caption text-center text-muted small mt-2';
            figcaption.innerHTML = `<i>*${img.alt}*</i>`;
            figure.appendChild(figcaption);
        }
    });
});

window.addEventListener('DOMContentLoaded', () => {
    // Theme Switcher Logic
    const themeSwitches = document.querySelectorAll('.theme-switch');
    
    function updateActiveThemeIcon(activeTheme) {
        themeSwitches.forEach(btn => {
            if (btn.getAttribute('data-theme') === activeTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Set initial active state
    const currentTheme = localStorage.getItem('theme') || 'dark';
    updateActiveThemeIcon(currentTheme);

    themeSwitches.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            document.documentElement.setAttribute('data-bs-theme', theme);
            localStorage.setItem('theme', theme);
            updateActiveThemeIcon(theme);
        });

        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
});

window.addEventListener('DOMContentLoaded', () => {
    // Settings Panel Logic
    const toggleBtn = document.getElementById('settingsToggleBtn');
    const panel = document.getElementById('settingsPanel');
    const container = document.getElementById('settingsDropdownContainer');
    
    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('show');
            const isExpanded = panel.classList.contains('show');
            toggleBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });

        // Prevent closing when clicking inside the panel
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Close when clicking outside
        document.addEventListener('click', () => {
            panel.classList.remove('show');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    }

    // Typography Logic
    const fontSelect = document.getElementById('fontFamilySelect');
    const sizeSlider = document.getElementById('fontSizeSlider');
    const widthSlider = document.getElementById('contentWidthSlider');

    if (fontSelect) {
        const savedFont = localStorage.getItem('fontFamily') || "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
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
        });

        sizeSlider.addEventListener('change', (e) => {
            const newSize = e.target.value;
            localStorage.setItem('fontSize', newSize);
        });
    }

    if (widthSlider) {
        const savedWidth = localStorage.getItem('contentWidth') || "700";
        widthSlider.value = savedWidth;
        
        widthSlider.addEventListener('input', (e) => {
            const newWidth = e.target.value;
            document.documentElement.style.setProperty('--bs-content-width', newWidth + 'px');
        });

        widthSlider.addEventListener('change', (e) => {
            const newWidth = e.target.value;
            localStorage.setItem('contentWidth', newWidth);
        });
    }
});
