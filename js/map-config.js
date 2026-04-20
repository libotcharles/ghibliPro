
function initMap() {

    const bounds = L.latLngBounds(
        L.latLng(-85, -180),
        L.latLng(85, 180)
    );

    window.map = L.map('atlas-map', {
        center: [35, 50],
        zoom: 3,
        minZoom: 2,
        maxZoom: 10,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        noWrap: true
    }).addTo(window.map);

    window.map.whenReady(() => {
        console.log("🗺️ Mappa pronta");

        // 🔥 AUTO-SYNC: se i dati sono già pronti
        if (window.displayedFilms) {
            loadMarkers(window.displayedFilms);
        }
    });

    return window.map;
}