window.map = null;
window.baseLayers = {};
window.currentBaseLayerKey = 'light';

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

    window.baseLayers = {
        light: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            subdomains: 'abcd',
            noWrap: true,
            updateWhenZooming: false,
            updateWhenIdle: true,
            keepBuffer: 5
        }),

        voyager: L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            subdomains: 'abcd',
            noWrap: true,
            updateWhenZooming: false,
            updateWhenIdle: true,
            keepBuffer: 5
        }),

        dark: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '© OpenStreetMap © CARTO',
            subdomains: 'abcd',
            noWrap: true,
            updateWhenZooming: false,
            updateWhenIdle: true,
            keepBuffer: 5
        })
    };

    window.baseLayers[window.currentBaseLayerKey].addTo(window.map);

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

/* =========================
   🎨 CAMBIA STILE MAPPA
========================= */
function cycleMapStyle() {
    if (!window.map || !window.baseLayers) return;

    const order = ['light', 'voyager', 'dark'];
    const currentIndex = order.indexOf(window.currentBaseLayerKey);
    const nextIndex = (currentIndex + 1) % order.length;
    const nextKey = order[nextIndex];

    if (window.baseLayers[window.currentBaseLayerKey]) {
        window.map.removeLayer(window.baseLayers[window.currentBaseLayerKey]);
    }

    window.currentBaseLayerKey = nextKey;
    window.baseLayers[nextKey].addTo(window.map);
}