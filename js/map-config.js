window.map = null;
window.baseLayer = null;

/* =========================
   🗺️ CREA MAPPA DINAMICA
========================= */
function initMap() {
    if (window.map) return window.map;

    const bounds = L.latLngBounds(
        L.latLng(-85, -180),
        L.latLng(85, 180)
    );

    window.map = L.map('atlas-map', {
        center: [28, 15],
        zoom: 2.4,
        minZoom: 2,
        maxZoom: 18,
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        maxBounds: bounds,
        maxBoundsViscosity: 0.8,
        zoomControl: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
        fadeAnimation: true,
        worldCopyJump: false,
        preferCanvas: true
    });

    window.baseLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        noWrap: true,
        updateWhenZooming: false,
        updateWhenIdle: true,
        keepBuffer: 5
    });

    window.baseLayer.addTo(window.map);

    window.map.on('zoomstart movestart', () => {
        document.body.classList.add('map-is-busy');
    });

    window.map.on('zoomend moveend', () => {
        document.body.classList.remove('map-is-busy');
    });

    window.map.whenReady(() => {
        requestAnimationFrame(() => {
            window.map.invalidateSize();
        });
    });

    return window.map;
}