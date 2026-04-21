window.activeMarkers = [];

/* =========================
   🎯 CREA ICONA MARKER CON EMOJI
========================= */
function createMarkerIcon(markerEmoji = '🎬') {
    return L.divIcon({
        html: `
            <div class="marker-content" aria-hidden="true">
                <span class="marker-emoji">${markerEmoji}</span>
            </div>
        `,
        iconSize: [45, 45],
        iconAnchor: [22, 22],
        popupAnchor: [0, -22],
        className: 'ghibli-marker'
    });
}

function getMarkerContentElement(marker) {
    return marker?._icon?.querySelector('.marker-content') || null;
}

/* =========================
   🧹 RIMUOVI MARKER
========================= */
function clearMarkers() {
    if (!window.map) return;

    window.activeMarkers.forEach((marker) => {
        if (window.map.hasLayer(marker)) {
            window.map.removeLayer(marker);
        }
    });

    window.activeMarkers = [];
}

/* =========================
   🗺️ CARICA MARKER
========================= */
function loadMarkers(films) {
    if (!window.map || !Array.isArray(films)) return;

    clearMarkers();

    films.forEach((film) => {
        if (typeof film.lat !== 'number' || typeof film.lng !== 'number') return;

        const marker = L.marker([film.lat, film.lng], {
            icon: createMarkerIcon(film.marker),
            riseOnHover: true,
            keyboard: false
        }).addTo(window.map);

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

        window.activeMarkers.push(marker);
    });

    console.log('📍 Marker caricati:', window.activeMarkers.length);
}