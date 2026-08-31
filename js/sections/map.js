// --- 1. DÉFINITION DE L'ITINÉRAIRE (Coordonnées) ---

const destinations = [
    {
        name: "Départ : Saint-Étienne",
        lat: 45.4397,
        lng: 4.3872,
        date: "16 février 2027",
        pays: "France",
        description: "Point de départ de notre aventure ! Départ de Saint-Étienne un jour avant le village départ officiel à Biarritz."
    },
    {
        name: "Village Départ",
        lat: 43.4832,
        lng: -1.5586,
        date: "17 & 18 février 2027",
        pays: "Biarritz",
        description: "Point de départ officiel du 4L Trophy ! Départ de Biarritz pour commencer notre périple vers le Maroc."
    },
    {
        name: "Premier bivouac",
        lat: 36.1408,
        lng: -5.4562,
        date: "19 & 20 février 2027",
        pays: "Algeciras Espagne",
        description: "Premier bivouac en Espagne avant la traversée vers l'Afrique. Nuit sous les étoiles avec tous les équipages."
    },
    {
        name: "Traversée en bateau",
        lat: 35.7595,
        lng: -5.8330,
        date: "20 & 21 février 2027",
        pays: "Détroit de Gibraltar",
        description: "Traversée du détroit de Gibraltar en ferry. Passage de l'Europe vers l'Afrique, arrivée à Tanger au Maroc."
    },
    {
        name: "6 étapes sportives",
        lat: 31.0801,
        lng: -4.0061,
        date: "22 & 26 février 2027",
        pays: "Désert du Sahara",
        description: "6 jours d'étapes sportives dans le désert marocain ! Navigation à la boussole, dunes de sable et pistes désertiques."
    },
    {
        name: "Ligne d'arrivée",
        lat: 31.6295,
        lng: -7.9811,
        date: "26 février 2027",
        pays: "Marrakech",
        description: "Ligne d'arrivée à Marrakech ! Fin des étapes sportives, début des festivités."
    }
];

// Segments où un routage routier réel a du sens (OSRM).
const ROUTABLE_SEGMENTS = new Set([0, 1, 3, 4]); // Saint-Étienne→Biarritz, Biarritz→Algeciras, Détroit→désert, désert→Marrakech (index du segment = index du point de départ)

// Le segment absent de la liste ci-dessus (traversée en ferry) reste en ligne directe.

// --- 2. INITIALISATION DE LA CARTE ---

const INITIAL_LAT = 38;
const INITIAL_LNG = -1.5;
const INITIAL_ZOOM = 4.3;

// Style vectoriel sombre, gratuit et sans clé API (OpenFreeMap)
const map = new maplibregl.Map({
    container: 'mapid',
    style: 'https://tiles.openfreemap.org/styles/dark',
    center: [INITIAL_LNG, INITIAL_LAT],
    zoom: INITIAL_ZOOM,
    pitch: 0,
    antialias: true,
    attributionControl: { compact: true }
});

map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
map.addControl(new maplibregl.FullscreenControl(), 'top-right');

// Recalcule la taille du canvas si le conteneur change (polices qui finissent
// de charger, layout flex qui se stabilise après coup, etc.). Sans ça, une
// projection calculée sur de mauvaises dimensions décale les marqueurs tant
// qu'aucun zoom manuel ne force MapLibre à se recalculer.
if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => map.resize()).observe(document.getElementById('mapid'));
}

// Couleurs de la charte graphique
const COLOR_ROUTE = '#00a650';

// --- 3bis. MARQUEURS + POPUPS PAR ÉTAPE ---

function buildPopupHTML(dest) {
    return `
        <div class="map-popup">
            <h3>${dest.name}</h3>
            <p class="popup-pays">📍 ${dest.pays}</p>
            <p class="popup-date">🗓️ ${dest.date}</p>
            <p class="popup-desc">${dest.description}</p>
        </div>
    `;
}

// Les marqueurs sont créés à la demande : soit au clic dans la liste, soit
// automatiquement au fur et à mesure que la voiture atteint chaque ville
// pendant l'animation du tracé. Une fois posé, un marqueur reste affiché
// (trace cumulative des étapes déjà parcourues).
const stepMarkers = new Array(destinations.length).fill(null);

// Une seule popup ouverte à la fois : on ferme la précédente dès qu'une
// nouvelle s'ouvre (MapLibre ne le fait pas automatiquement, contrairement à Leaflet).
let openPopup = null;

function getOrCreateMarker(index) {
    let marker = stepMarkers[index];
    if (marker) return marker;

    const dest = destinations[index];
    const markerEl = document.createElement('div');
    markerEl.className = 'maplibre-marker';

    if (index === 0) {
        markerEl.classList.add('marker-start');
    } else if (index === destinations.length - 1) {
        markerEl.classList.add('marker-end');
    } else {
        markerEl.classList.add('marker-step');
    }

    markerEl.innerHTML = `
        <div class="marker-pulse"></div>
        <div class="marker-pin"></div>
    `;

    const popup = new maplibregl.Popup({ offset: 20 }).setHTML(buildPopupHTML(dest));

    popup.on('open', () => {
        if (openPopup && openPopup !== popup) {
            openPopup.remove();
        }
        openPopup = popup;
    });

    popup.on('close', () => {
        if (openPopup === popup) {
            openPopup = null;
        }
    });

    marker = new maplibregl.Marker({ element: markerEl, anchor: 'center' })
        .setLngLat([dest.lng, dest.lat])
        .setPopup(popup)
        .addTo(map);

    stepMarkers[index] = marker;
    return marker;
}

// Clic manuel dans la liste : affiche le point de cette ville et ouvre son popup.
function showMarkerForDestination(index) {
    const marker = getOrCreateMarker(index);
    const popup = marker.getPopup();
    if (popup && !popup.isOpen()) {
        marker.togglePopup();
    }
}

// Passage automatique de la voiture pendant l'animation : pose juste le point, sans popup.
function revealMarkerForDestination(index) {
    getOrCreateMarker(index);
}

// --- 4. PANNEAU LATÉRAL AVEC LA LISTE DES DESTINATIONS ---

const destinationList = document.getElementById('destination-list');

destinations.forEach((dest, index) => {
    const item = document.createElement('div');
    item.className = 'destination-item';

    if (index === 0) {
        item.classList.add('start');
    } else if (index === destinations.length - 1) {
        item.classList.add('end');
    }

    item.innerHTML = `
        <h3>${dest.name}</h3>
        <p class="pays">📍 ${dest.pays}</p>
        <p class="date">${dest.date}</p>
    `;

    item.addEventListener('click', () => {
        map.flyTo({ center: [dest.lng, dest.lat], zoom: 7, pitch: 0, essential: true });
        showMarkerForDestination(index);
    });

    destinationList.appendChild(item);
});

// --- 5. CALCUL DE L'ITINÉRAIRE RÉEL (OSRM) ---

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving/';

async function fetchRoadSegment(start, end) {
    const url = `${OSRM_BASE_URL}${start[0]},${start[1]};${end[0]},${end[1]}?overview=full&geometries=geojson`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`OSRM HTTP ${response.status}`);

        const data = await response.json();
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
            return data.routes[0].geometry.coordinates;
        }
        throw new Error('OSRM: aucun itinéraire trouvé');
    } catch (err) {
        console.warn('Routage OSRM indisponible pour ce segment, ligne directe utilisée à la place.', err);
        return [start, end];
    }
}

async function buildFullRoute() {
    const segments = [];
    const destinationIndices = [0]; // index dans `segments` de chaque destination, dans l'ordre

    for (let i = 0; i < destinations.length - 1; i++) {
        const start = [destinations[i].lng, destinations[i].lat];
        const end = [destinations[i + 1].lng, destinations[i + 1].lat];

        let segmentCoords;
        if (ROUTABLE_SEGMENTS.has(i)) {
            segmentCoords = await fetchRoadSegment(start, end);
        } else {
            // Traversée en ferry : ligne directe
            segmentCoords = [start, end];
        }

        // Éviter de dupliquer le point de jonction entre segments
        if (segments.length > 0) {
            segments.push(...segmentCoords.slice(1));
        } else {
            segments.push(...segmentCoords);
        }

        destinationIndices.push(segments.length - 1);
    }

    return { coords: segments, destinationIndices };
}

// --- 6. TRACÉ DU CHEMIN (ANIMÉ) ---

const ROUTE_SOURCE_ID = 'route-progress';
const ROUTE_LAYER_ID = 'route-progress-line';
const ROUTE_GLOW_LAYER_ID = 'route-progress-glow';

let routeCoordinates = destinations.map(d => [d.lng, d.lat]); // fallback avant chargement OSRM
let cumulativeDistances = [0]; // distance cumulée jusqu'à chaque point de routeCoordinates
let destinationIndices = destinations.map((_, i) => i); // index dans routeCoordinates de chaque ville, mis à jour une fois OSRM chargé
let nextDestinationToReveal = 1; // destination[0] est révélée dès le départ de l'animation
let currentPointIndex = 0;
const ANIMATION_DURATION_MS = 10000; // durée totale du parcours animé, indépendante du nombre de points
let animationStartTime = null;
let animationsStarted = false;
let mapLoaded = false;
let routeReady = false;

// Construit la table des distances cumulées le long du tracé, pour pouvoir
// avancer à vitesse constante (par distance) plutôt que par index de point.
// Sans ça, les segments plus densément échantillonnés (courbes du désert)
// seraient parcourus beaucoup plus lentement que les segments à peu de points.
function computeCumulativeDistances(coords) {
    const distances = [0];
    for (let i = 1; i < coords.length; i++) {
        const [lng1, lat1] = coords[i - 1];
        const [lng2, lat2] = coords[i];
        const d = Math.sqrt((lng2 - lng1) ** 2 + (lat2 - lat1) ** 2);
        distances.push(distances[i - 1] + d);
    }
    return distances;
}

// Trouve l'index du point atteint pour une distance parcourue donnée
// (recherche linéaire à partir du dernier index connu, suffisant ici).
function indexForDistance(targetDistance, fromIndex) {
    let index = fromIndex;
    while (index < cumulativeDistances.length - 1 && cumulativeDistances[index + 1] <= targetDistance) {
        index++;
    }
    return index;
}

function emptyLineFeature(coords) {
    return {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: coords },
        properties: {}
    };
}

function setupLayers() {
    map.addSource(ROUTE_SOURCE_ID, {
        type: 'geojson',
        data: emptyLineFeature([])
    });

    map.addLayer({
        id: ROUTE_GLOW_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
            'line-color': COLOR_ROUTE,
            'line-width': 12,
            'line-blur': 6,
            'line-opacity': 0.35
        }
    });

    map.addLayer({
        id: ROUTE_LAYER_ID,
        type: 'line',
        source: ROUTE_SOURCE_ID,
        layout: { 'line-join': 'round', 'line-cap': 'round' },
        paint: {
            'line-color': COLOR_ROUTE,
            'line-width': 4,
            'line-opacity': 0.9
        }
    });

    mapLoaded = true;
    tryStartAnimation();
}

function tryStartAnimation() {
    if (!mapLoaded || !routeReady || animationsStarted) return;
    animationsStarted = true;

    // Révèle le point de départ dès le début de l'animation
    revealMarkerForDestination(0);

    // Le conteneur peut ne pas avoir sa taille finale au moment du chargement
    // (polices/layout pas encore stabilisés) : MapLibre calcule alors la
    // projection avec un canvas de mauvaises dimensions, ce qui décale les
    // marqueurs tant qu'aucune interaction (zoom) ne force un recalcul.
    map.resize();

    // Ajuster la vue pour englober tout le tracé réel
    const bounds = routeCoordinates.reduce(
        (b, coord) => b.extend(coord),
        new maplibregl.LngLatBounds(routeCoordinates[0], routeCoordinates[0])
    );
    map.fitBounds(bounds, { padding: 60, pitch: 0, duration: 0 });

    setTimeout(() => {
        requestAnimationFrame(animatePathPointByPoint);
    }, 1000);
}

function animatePathPointByPoint(timestamp) {
    if (animationStartTime === null) animationStartTime = timestamp;

    const elapsed = timestamp - animationStartTime;
    const progress = Math.min(elapsed / ANIMATION_DURATION_MS, 1);
    const totalDistance = cumulativeDistances[cumulativeDistances.length - 1];
    const targetDistance = progress * totalDistance;
    const targetIndex = indexForDistance(targetDistance, currentPointIndex);

    if (targetIndex > currentPointIndex || progress >= 1) {
        currentPointIndex = targetIndex;

        const currentCoords = routeCoordinates.slice(0, currentPointIndex + 1);

        const routeSource = map.getSource(ROUTE_SOURCE_ID);
        if (routeSource) routeSource.setData(emptyLineFeature(currentCoords));

        updateCarPosition(currentCoords);

        // Révèle chaque ville dont le jalon vient d'être atteint par la voiture
        while (
            nextDestinationToReveal < destinationIndices.length &&
            currentPointIndex >= destinationIndices[nextDestinationToReveal]
        ) {
            revealMarkerForDestination(nextDestinationToReveal);
            nextDestinationToReveal++;
        }
    }

    if (progress < 1) {
        requestAnimationFrame(animatePathPointByPoint);
    } else {
        console.log("Arrivée à Marrakech !");
    }
}

map.on('load', setupLayers);

buildFullRoute().then(({ coords, destinationIndices: indices }) => {
    routeCoordinates = coords;
    cumulativeDistances = computeCumulativeDistances(coords);
    destinationIndices = indices;
    routeReady = true;
    tryStartAnimation();
});

// --- 7. ICÔNE DE LA 4L COMME INDICATEUR DIRECTEUR SUR LA CARTE ---
// Marqueur DOM MapLibre standard, toujours affiché à l'horizontale (pas de
// rotation selon le cap), positionné le long du tracé routé réel.

const carEl = document.createElement('div');
carEl.className = 'car-marker-icon';
carEl.innerHTML = '<img src="images/4L.png" alt="" />';

const carMarker = new maplibregl.Marker({ element: carEl })
    .setLngLat(routeCoordinates[0])
    .addTo(map);

function updateCarPosition(coordsUpToNow) {
    if (coordsUpToNow.length === 0) return;

    const lastPoint = coordsUpToNow[coordsUpToNow.length - 1];
    carMarker.setLngLat(lastPoint);
}
