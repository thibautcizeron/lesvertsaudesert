/**
 * Script pour la page des mentions légales
 * Les Verts au Désert - 4L Trophy 2027
 */

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll pour les liens internes (si nécessaire)
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animation d'entrée pour les sections
    const sections = document.querySelectorAll('.legal-section');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    // Bouton retour avec animation
    const backLink = document.querySelector('.back-link');
    if (backLink) {
        backLink.addEventListener('mouseenter', function() {
            this.querySelector('svg').style.transform = 'translateX(-3px)';
        });

        backLink.addEventListener('mouseleave', function() {
            this.querySelector('svg').style.transform = 'translateX(0)';
        });
    }

    // Effet de parallaxe léger au scroll
    let scrollPosition = 0;

    window.addEventListener('scroll', function() {
        scrollPosition = window.scrollY;

        const legalContainer = document.querySelector('.legal-container');
        if (legalContainer && scrollPosition < 500) {
            legalContainer.style.transform = `translateY(${scrollPosition * 0.05}px)`;
        }
    });
});
