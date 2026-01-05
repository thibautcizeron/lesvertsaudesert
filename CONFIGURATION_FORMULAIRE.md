# Configuration du Formulaire de Contact

Le formulaire de contact est configuré pour envoyer les messages à l'adresse email **lesvertsaudesert@gmail.com**.

## Option 1 : Formspree (Recommandé - Gratuit et Simple)

Formspree est un service gratuit qui permet de recevoir des emails depuis un formulaire HTML sans backend.

### Étapes de configuration :

1. **Créer un compte Formspree** :
   - Allez sur [https://formspree.io](https://formspree.io)
   - Cliquez sur "Sign Up" pour créer un compte gratuit
   - Connectez-vous avec votre adresse email

2. **Créer un nouveau formulaire** :
   - Une fois connecté, cliquez sur "+ New Form"
   - Donnez un nom au formulaire : "Les Verts au Désert - Contact"
   - Entrez l'email de destination : `lesvertsaudesert@gmail.com`
   - Cliquez sur "Create Form"

3. **Récupérer l'ID du formulaire** :
   - Formspree vous donnera un "Form Endpoint" qui ressemble à :
     ```
     https://formspree.io/f/xyzabc123
     ```
   - L'ID du formulaire est la partie après `/f/` (par exemple : `xyzabc123`)

4. **Configurer le site** :
   - Ouvrez le fichier `index.html`
   - Trouvez la ligne 385 :
     ```html
     <form class="contact-form-centered" id="contact-form" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
     ```
   - Remplacez `YOUR_FORM_ID` par votre ID Formspree réel :
     ```html
     <form class="contact-form-centered" id="contact-form" action="https://formspree.io/f/xyzabc123" method="POST">
     ```

5. **Tester le formulaire** :
   - Ouvrez votre site dans un navigateur
   - Allez à la section Contact
   - Remplissez et soumettez le formulaire
   - Le premier envoi nécessitera une confirmation par email
   - Après confirmation, tous les messages seront envoyés automatiquement

### Plan gratuit Formspree :
- ✅ 50 soumissions par mois
- ✅ Protection anti-spam
- ✅ Notifications par email
- ✅ Stockage des soumissions pendant 30 jours

---

## Option 2 : Solution de secours (Mailto)

Si Formspree n'est pas configuré ou ne fonctionne pas, le formulaire utilisera automatiquement une solution de secours qui ouvrira le client email par défaut de l'utilisateur avec les informations pré-remplies.

Cette solution fonctionne immédiatement sans configuration supplémentaire.

---

## Fonctionnalités du formulaire

✅ **Validation des champs** : Tous les champs sont obligatoires
✅ **Loading state** : Affichage "Envoi en cours..." pendant l'envoi
✅ **Messages de confirmation** : Indication claire du succès ou de l'échec
✅ **Fallback automatique** : Si Formspree échoue, ouverture du client email
✅ **Responsive** : Fonctionne sur mobile, tablette et desktop

---

## Personnalisation

Pour changer l'adresse email de destination :

1. **Avec Formspree** :
   - Modifiez l'email dans les paramètres de votre formulaire Formspree

2. **Dans le fallback mailto** :
   - Ouvrez `js/sections/contact.js`
   - Ligne 36, modifiez l'email :
     ```javascript
     window.location.href = `mailto:VOTRE_NOUVELLE_ADRESSE@exemple.com?subject=${subject}&body=${body}`;
     ```

---

## Dépannage

### Le formulaire ne s'envoie pas
1. Vérifiez que vous avez bien remplacé `YOUR_FORM_ID` par votre ID Formspree réel
2. Vérifiez la console du navigateur (F12) pour voir les erreurs
3. Assurez-vous d'avoir confirmé votre email sur Formspree

### Les emails n'arrivent pas
1. Vérifiez le dossier spam de `lesvertsaudesert@gmail.com`
2. Connectez-vous à Formspree pour voir les soumissions reçues
3. Vérifiez que l'email de destination est correct dans Formspree

---

## Support

Pour toute question sur la configuration :
- Documentation Formspree : [https://help.formspree.io](https://help.formspree.io)
- Contact : lesvertsaudesert@gmail.com
