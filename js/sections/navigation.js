// ===== NAVIGATION =====

// Attendre que le DOM soit chargé
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-dropdown-toggle)');
    const dropdownLinks = document.querySelectorAll('.dropdown-link');
    const navbar = document.querySelector('.navbar');

    // ===== DROPDOWNS =====
    const dropdowns = document.querySelectorAll('.nav-dropdown');

    function closeAllDropdowns(except) {
        dropdowns.forEach(dd => {
            if (dd !== except) {
                dd.classList.remove('open');
                dd.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
            }
        });
    }

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.nav-dropdown-toggle');
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('open');
            closeAllDropdowns(dropdown);
            dropdown.classList.toggle('open', !isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });
    });

    // Fermer dropdowns au clic en dehors
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-dropdown')) {
            closeAllDropdowns(null);
        }
    });

    // Fermer dropdown au clic sur un lien interne
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeAllDropdowns(null);
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // ===== HAMBURGER =====
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', (e) => {
            e.preventDefault();
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                closeAllDropdowns(null);
            });
        });

        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    // ===== SCROLL EFFECT =====
    let scrollTicking = false;
    window.addEventListener('scroll', () => {
        if (!scrollTicking) {
            requestAnimationFrame(() => {
                const currentScroll = window.pageYOffset;
                if (currentScroll > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    }, { passive: true });
});
