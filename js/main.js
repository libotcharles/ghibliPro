window.activeMarkers = [];

/* =========================
   🎯 CREA ICONA MARKER CON EMOJI
========================= */
function createMarkerIcon(markerEmoji) {
    // Creiamo un'icona HTML con l'emoji
    const html = `
        <div style="
            display: flex;
            justify-content: center;
            align-items: center;
            width: 45px;
            height: 45px;
            background: #6b8e7f;
            border: 3px solid white;
            border-radius: 50%;
            font-size: 28px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            transition: all 0.3s ease;
        ">
            ${markerEmoji}
        </div>
    `;

    return L.divIcon({
        html: html,
        iconSize: [45, 45],
        iconAnchor: [22, 45],
        popupAnchor: [0, -45],
        className: 'ghibli-marker'
    });
}

/* =========================
   🧹 RIMUOVI MARKER
========================= */
function clearMarkers() {
    if (!window.map) return;

    window.activeMarkers.forEach(marker => {
        window.map.removeLayer(marker);
    });

    window.activeMarkers = [];
}

/* =========================
   🗺️ CARICA MARKER
========================= */
function loadMarkers(films) {
    if (!window.map || !films || !Array.isArray(films)) return;

    clearMarkers();

    films.forEach((film) => {
        const marker = L.marker([film.lat, film.lng], {
            icon: createMarkerIcon(film.marker || '🎬')
        })
        .addTo(window.map);

        // 🎬 CLICK PER APRIRE PANNELLO
        marker.on('click', (e) => {
            e.originalEvent.stopPropagation();
            
            // Animazione zoom fluida
            const iconElement = marker._icon;
            if (iconElement) {
                iconElement.classList.add('clicked');
                setTimeout(() => {
                    iconElement.classList.remove('clicked');
                }, 800);
            }

            // Apri pannello
            if (window.UI && typeof window.UI.openPanel === 'function') {
                window.UI.openPanel(film);
            }
        });

        window.activeMarkers.push(marker);
    });

    console.log("📍 Marker caricati:", films.length);
}