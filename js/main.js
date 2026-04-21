window.activeMarkers = [];
window.markerClusterGroup = null;

/* =========================
   🎯 CREA ICONA MARKER
========================= */
function createMarkerIcon(markerEmoji = '🎬') {
    return L.divIcon({
        html: `
            <div class="marker-content" aria-hidden="true">
                <span class="marker-emoji">${markerEmoji}</span>
            </div>
        `,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
        popupAnchor: [0, -20],
        className: 'ghibli-marker'
    });
}

function getMarkerContentElement(marker) {
    return marker?._icon?.querySelector('.marker-content') || null;
}

/* =========================
   🧼 PULISCI MARKER
========================= */
function clearMarkers() {
    if (window.markerClusterGroup) {
        window.markerClusterGroup.clearLayers();
    }

    window.activeMarkers = [];
}

/* =========================
   📦 CREA CLUSTER GROUP
========================= */
function ensureClusterGroup() {
    if (!window.map) return null;

    if (window.markerClusterGroup) return window.markerClusterGroup;

    window.markerClusterGroup = L.markerClusterGroup({
        showCoverageOnHover: false,
        spiderfyOnMaxZoom: true,
        zoomToBoundsOnClick: true,
        removeOutsideVisibleBounds: true,
        animate: true,
        animateAddingMarkers: true,
        disableClusteringAtZoom: 6,
        maxClusterRadius: 50,
        iconCreateFunction: function (cluster) {
            const count = cluster.getChildCount();

            return L.divIcon({
                html: `
                    <div class="ghibli-cluster">
                        <span>${count}</span>
                    </div>
                `,
                className: 'ghibli-cluster-wrapper',
                iconSize: [52, 52]
            });
        }
    });

    window.map.addLayer(window.markerClusterGroup);
    return window.markerClusterGroup;
}

/* =========================
   🗺️ CARICA MARKER
========================= */
function loadMarkers(films) {
    if (!window.map || !Array.isArray(films)) return;

    const clusterGroup = ensureClusterGroup();
    if (!clusterGroup) return;

    clearMarkers();

    const validMarkers = [];

    films.forEach((film) => {
        if (typeof film.lat !== 'number' || typeof film.lng !== 'number') return;

        const marker = L.marker([film.lat, film.lng], {
            icon: createMarkerIcon(film.marker || '🎬'),
            riseOnHover: true,
            keyboard: false,
            title: film.title || 'Film'
        });

        marker.on('click', (e) => {
            e.originalEvent?.stopPropagation?.();

            const iconElement = getMarkerContentElement(marker);
            if (iconElement) {
                iconElement.classList.remove('clicked');
                void iconElement.offsetWidth;
                iconElement.classList.add('clicked');

                setTimeout(() => {
                    iconElement.classList.remove('clicked');
                }, 420);
            }

            if (window.UI && typeof window.UI.openPanel === 'function') {
                window.UI.openPanel(film);
            }
        });

        validMarkers.push(marker);
        window.activeMarkers.push(marker);
    });

    clusterGroup.addLayers(validMarkers);

    console.log('📍 Marker caricati:', window.activeMarkers.length);
}

/* =========================
   🔎 MOSTRA TUTTI I MARKER
========================= */
function fitMapToMarkers(padding = [40, 40]) {
    if (!window.map || !window.activeMarkers.length) return;

    const group = L.featureGroup(window.activeMarkers);
    const bounds = group.getBounds();

    if (!bounds.isValid()) return;

    window.map.fitBounds(bounds, {
        padding,
        animate: true,
        duration: 1.1,
        maxZoom: 5
    });
}

/* =========================
   🎯 FOCUS SU UN FILM
========================= */
function focusOnFilm(film) {
    if (!window.map || !film) return;

    window.map.flyTo([film.lat, film.lng], 7, {
        animate: true,
        duration: 1.6,
        easeLinearity: 0.2
    });

    window.map.once('moveend', () => {
        if (window.UI && typeof window.UI.openPanel === 'function') {
            window.UI.openPanel(film);
        }
    });
}