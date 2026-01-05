// ===== SMOOTH SCROLL =====

// Fonction pour obtenir l'offset dynamique selon la taille d'écran
function getScrollOffset() {
    return window.innerWidth <= 768 ? 96 : 101;
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Ignorer les liens vides ou #
        if (!href || href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            // Calculer la position avec l'offset dynamique
            const offset = getScrollOffset();
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

            // Scroll avec animation fluide
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===== SCROLL INDICATOR =====
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 200) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}
