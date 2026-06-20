/*!
* Start Bootstrap - Clean Blog v6.0.8 (https://startbootstrap.com/theme/clean-blog)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-clean-blog/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', () => {
    let scrollPos = 0;
    const mainNav = document.getElementById('mainNav');
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
