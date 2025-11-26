// --- 1. DÉFINITION DE L'ITINÉRAIRE (Coordonnées) ---

const destinations = [
    {
        name: "Départ : Saint-Étienne",
        lat: 45.4397,
        lng: 4.3872,
        date: "17.02.2027",
        pays: "France",
        description: "Point de départ de notre aventure du 4L Trophy ! Départ de Saint-Étienne pour commencer notre périple vers le Maroc."
    },
    {
        name: "Biarritz",
        lat: 43.4832,
        lng: -1.5586,
        date: "19-20.02.2027",
        pays: "France",
        description: "Étape sur la côte basque française. Dernière ville française avant de traverser l'Espagne."
    },
    {
        name: "Algéciras",
        lat: 36.1382,
        lng: -5.4418,
        date: "21-22.02.2027",
        pays: "Espagne",
        description: "Ville portuaire du sud de l'Espagne. Embarquement pour le ferry vers Tanger, traversée du détroit de Gibraltar."
    },
    {
        name: "Tanger",
        lat: 35.7595,
        lng: -5.8330,
        date: "22-23.02.2027",
        pays: "Maroc",
        description: "Première ville marocaine ! Arrivée en Afrique après la traversée du détroit de Gibraltar."
    },
    {
        name: "Merzouga",
        lat: 31.0801,
        lng: -4.0061,
        date: "24-28.02.2027 + 01.03.2027",
        pays: "Maroc",
        description: "Le désert du Sahara ! Dunes de l'Erg Chebbi, paysages magnifiques et journée libre le 01.03 pour profiter du désert."
    },
    {
        name: "Marrakech",
        lat: 31.6295,
        lng: -7.9811,
        date: "28.02.2027",
        pays: "Maroc",
        description: "Arrivée finale à Marrakech, la ville rouge ! Fin de l'aventure avant le retour vers la France le 02.03.2027."
    }
];

// --- 2. INITIALISATION DE LA CARTE ---

// Centrage initial de la vue
const INITIAL_LAT = 38;
const INITIAL_LNG = -1.5;
const INITIAL_ZOOM = 5;

// Création de l'objet carte, lié à l'ID 'mapid'
const map = L.map('mapid', {
    zoomControl: false, // On va ajouter un contrôle personnalisé
    attributionControl: true
}).setView([INITIAL_LAT, INITIAL_LNG], INITIAL_ZOOM);

// Ajout d'un style de carte moderne
const isDarkMode = false; // Changez à true pour mode sombre

if (isDarkMode) {
    // Mode sombre - CartoDB Dark Matter
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19
    }).addTo(map);
} else {
    // Mode clair - CartoDB Voyager (style moderne et coloré)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19
    }).addTo(map);
}

// Ajouter le contrôle de zoom personnalisé
L.control.zoom({
    position: 'topright'
}).addTo(map);


// --- 3. AJOUT DES MARQUEURS ET TRACÉ DU CHEMIN ---

const routeCoordinates = []; // Pour stocker les points du tracé
const markers = {}; // Pour stocker les références des marqueurs

destinations.forEach((dest, index) => {

    // 1. Stocker les coordonnées
    routeCoordinates.push([dest.lat, dest.lng]);

    // 2. Contenu de l'infobulle (popup) enrichi
    const popupContent = `
        <div style="text-align: center; min-width: 250px;">
            <h3 style="margin: 0 0 10px 0; color: #CC0000; font-size: 1.2em;">
                ${dest.name}
            </h3>
            <p style="margin: 5px 0; font-weight: bold; color: #333;">
                📍 ${dest.pays}
            </p>
            <p style="margin: 5px 0; font-style: italic; color: #666;">
                📅 ${dest.date}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 0.95em; line-height: 1.4; text-align: left;">
                ${dest.description}
            </p>
        </div>
    `;

    // 3. Personnaliser l'icône selon le type d'étape
    let markerIcon;
    if (index === 0) {
        // Icône verte pour le départ
        markerIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    } else if (index === destinations.length - 1) {
        // Icône rouge pour l'arrivée
        markerIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    } else {
        // Icône bleue pour les étapes intermédiaires
        markerIcon = new L.Icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });
    }

    // 4. Ajouter le marqueur à la carte avec l'icône personnalisée
    const marker = L.marker([dest.lat, dest.lng], { icon: markerIcon })
        .addTo(map)
        .bindPopup(popupContent);

    // 5. Stocker le marqueur pour pouvoir l'utiliser depuis le panneau latéral
    markers[index] = marker;
});

// --- 4. CRÉATION DU PANNEAU LATÉRAL AVEC LA LISTE DES DESTINATIONS ---

const destinationList = document.getElementById('destination-list');

destinations.forEach((dest, index) => {
    const item = document.createElement('div');
    item.className = 'destination-item';

    // Ajouter une classe spéciale pour le départ et l'arrivée
    if (index === 0) {
        item.classList.add('start');
    } else if (index === destinations.length - 1) {
        item.classList.add('end');
    }

    item.innerHTML = `
        <h3>${dest.name}</h3>
        <p class="pays">📍 ${dest.pays}</p>
        <p class="date">📅 ${dest.date}</p>
    `;

    // Ajouter un événement au clic pour centrer la carte et ouvrir le popup
    item.addEventListener('click', () => {
        map.setView([dest.lat, dest.lng], 8);
        markers[index].openPopup();
    });

    destinationList.appendChild(item);
});

// --- 5. TRACER LA POLYLIGNE (LE CHEMIN) AVEC ANIMATION POINT PAR POINT ---

// Créer la polyligne animée qui se dessine progressivement de ville en ville
const polylineAnimated = L.polyline([], {
    color: '#CC0000',
    weight: 5,
    opacity: 0.8,
    lineJoin: 'round',
    lineCap: 'round'
}).addTo(map);

// Variables pour l'animation point par point
let currentSegmentIndex = 0;
let segmentProgress = 0;
const animationSpeed = 0.008; // Vitesse de progression (plus petit = plus lent)

function animatePathPointByPoint() {
    if (isAnimationPaused) {
        requestAnimationFrame(animatePathPointByPoint);
        return;
    }

    if (currentSegmentIndex < routeCoordinates.length - 1) {
        const start = routeCoordinates[currentSegmentIndex];
        const end = routeCoordinates[currentSegmentIndex + 1];

        // Calculer la position actuelle entre start et end
        const lat = start[0] + (end[0] - start[0]) * segmentProgress;
        const lng = start[1] + (end[1] - start[1]) * segmentProgress;

        // Ajouter le nouveau point à la ligne
        const currentCoords = routeCoordinates.slice(0, currentSegmentIndex + 1);
        currentCoords.push([lat, lng]);
        polylineAnimated.setLatLngs(currentCoords);

        // Progresser
        segmentProgress += animationSpeed;

        // Passer au segment suivant si on a fini celui-ci
        if (segmentProgress >= 1) {
            currentSegmentIndex++;
            segmentProgress = 0;

            // Animer le marqueur de la ville atteinte
            if (currentSegmentIndex < routeCoordinates.length) {
                setTimeout(() => {
                    markers[currentSegmentIndex].openPopup();
                    setTimeout(() => {
                        markers[currentSegmentIndex].closePopup();
                    }, 2000);
                }, 100);
            }
        }

        requestAnimationFrame(animatePathPointByPoint);
    } else {
        // Animation terminée - on est arrivé à Marrakech
        polylineAnimated.setLatLngs(routeCoordinates);
        console.log("Arrivée à Marrakech !");
    }
}

// Démarrer l'animation après un court délai
setTimeout(() => {
    animatePathPointByPoint();
}, 1000);

// --- 6. AJUSTER LE ZOOM POUR QUE TOUTE LA ROUTE SOIT VISIBLE ---
// Créer des limites basées sur les coordonnées
const bounds = L.latLngBounds(routeCoordinates);
map.fitBounds(bounds, {
    padding: [50, 50]
});

// --- 7. AJOUTER UN INDICATEUR DE VOYAGE (VOITURE ANIMÉE) ---
const carIcon = L.icon({
    iconUrl: 'images/4L.png',
    iconSize: [50, 40],
    iconAnchor: [20, 20]
});

const carMarker = L.marker(routeCoordinates[0], {
    icon: carIcon,
    zIndexOffset: 1000
}).addTo(map);

// Animer la voiture le long du trajet (s'arrête à Marrakech)
function animateCar() {
    if (isAnimationPaused) {
        requestAnimationFrame(animateCar);
        return;
    }

    if (currentSegmentIndex < routeCoordinates.length - 1) {
        const start = routeCoordinates[currentSegmentIndex];
        const end = routeCoordinates[currentSegmentIndex + 1];

        const lat = start[0] + (end[0] - start[0]) * segmentProgress;
        const lng = start[1] + (end[1] - start[1]) * segmentProgress;

        carMarker.setLatLng([lat, lng]);
        requestAnimationFrame(animateCar);
    } else if (currentSegmentIndex === routeCoordinates.length - 1) {
        // Arrivé à Marrakech - positionner la voiture au dernier point
        carMarker.setLatLng(routeCoordinates[routeCoordinates.length - 1]);
        console.log("La voiture est arrivée à Marrakech !");
    }
}

setTimeout(animateCar, 1000);

// --- 8. CONTRÔLES INTERACTIFS POUR L'ANIMATION ---

let isAnimationPaused = false;

// Bouton pause/lecture
const toggleBtn = document.getElementById('toggle-animation');
const animationIcon = document.getElementById('animation-icon');

toggleBtn.addEventListener('click', () => {
    isAnimationPaused = !isAnimationPaused;

    if (isAnimationPaused) {
        animationIcon.textContent = '▶️';
        toggleBtn.innerHTML = '<span id="animation-icon">▶️</span> Reprendre';
    } else {
        animationIcon.textContent = '⏸️';
        toggleBtn.innerHTML = '<span id="animation-icon">⏸️</span> Pause Animation';
        // Relancer l'animation
        animatePathPointByPoint();
        animateCar();
    }
});

// Bouton reset
const resetBtn = document.getElementById('reset-animation');
resetBtn.addEventListener('click', () => {
    // Réinitialiser les variables
    currentSegmentIndex = 0;
    segmentProgress = 0;
    polylineAnimated.setLatLngs([]);
    carMarker.setLatLng(routeCoordinates[0]);

    // Redémarrer les animations
    isAnimationPaused = false;
    animationIcon.textContent = '⏸️';
    toggleBtn.innerHTML = '<span id="animation-icon">⏸️</span> Pause Animation';

    setTimeout(() => {
        animatePathPointByPoint();
        animateCar();
    }, 100);

    // Recentrer la carte
    map.setView([INITIAL_LAT, INITIAL_LNG], INITIAL_ZOOM);
});
