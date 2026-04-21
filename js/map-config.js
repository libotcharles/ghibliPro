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
        zoomSnap: 0.25,
        zoomDelta: 0.5,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        zoomControl: true,
        zoomAnimation: true,
        markerZoomAnimation: true,
        fadeAnimation: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CARTO',
        subdomains: 'abcd',
        noWrap: true,
        updateWhenZooming: false,
        updateWhenIdle: true,
        keepBuffer: 4
    }).addTo(window.map);

    window.map.on('zoomstart', () => {
        document.body.classList.add('map-is-zooming');
    });

    window.map.on('zoomend moveend', () => {
        document.body.classList.remove('map-is-zooming');
    });

    window.map.whenReady(() => {
        console.log('🗺️ Mappa pronta');

        requestAnimationFrame(() => {
            window.map.invalidateSize();

            if (window.displayedFilms) {
                loadMarkers(window.displayedFilms);
            }
        });
    });

    return window.map;
}