// ===== CONTACT FORM =====

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Récupérer les données du formulaire
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message');

            // Désactiver le bouton et afficher le loading
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';

            try {
                // Option 1: Utiliser Formspree (recommandé)
                // Pour utiliser Formspree, remplacez YOUR_FORM_ID dans index.html
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Succès
                    showStatus('success', '✅ Message envoyé avec succès ! Nous vous répondrons bientôt.');
                    contactForm.reset();
                } else {
                    // Erreur du serveur
                    showStatus('error', '❌ Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement par email.');
                }
            } catch (error) {
                // Erreur réseau ou autre
                console.error('Erreur:', error);

                // Solution de secours: ouvrir le client email
                const subject = encodeURIComponent('Contact depuis le site Les Verts au Désert');
                const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
                window.location.href = `mailto:lesvertsaudesert@gmail.com?subject=${subject}&body=${body}`;

                showStatus('info', 'Votre client email va s\'ouvrir pour envoyer le message.');
            } finally {
                // Réactiver le bouton
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
            }
        });
    }

    function showStatus(type, message) {
        formStatus.style.display = 'block';
        formStatus.className = `form-status-${type}`;
        formStatus.textContent = message;

        // Masquer le message après 5 secondes
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
});
