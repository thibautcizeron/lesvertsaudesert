// ===== SCROLL ANIMATIONS =====

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.projet-card, .membre-card, .partenaire-card').forEach(el => {
    observer.observe(el);
});

// ===== STATS COUNTER ANIMATION =====
const stats = document.querySelectorAll('.stat-number');
const statsSection = document.querySelector('.hero');

const animateStats = () => {
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current);
            }
        }, 30);
    });
};

// Trigger animation when page loads
setTimeout(animateStats, 500);

// ===== PARCOURS MAP ANIMATION =====
const routePath = document.getElementById('route-path');

// Observe when map section is visible
const mapObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate the route path
            if (routePath) {
                const pathLength = routePath.getTotalLength();
                routePath.style.strokeDasharray = pathLength;
                routePath.style.strokeDashoffset = pathLength;

                // Trigger route animation with delay
                setTimeout(() => {
                    routePath.style.strokeDashoffset = '0';
                }, 500);
            }

            mapObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const parcoursSection = document.querySelector('.parcours-section');
if (parcoursSection) {
    mapObserver.observe(parcoursSection);
}

// ===== FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Merci pour votre message ! Nous vous répondrons rapidement.');
        contactForm.reset();
    });
}

export { observer, animateStats };
