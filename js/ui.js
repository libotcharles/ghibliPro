window.UI = {};

/* =========================
   📂 OPEN PANEL
========================= */
window.UI.openPanel = function (film) {
    const panel = document.getElementById('detail-panel');
    if (!panel || !film) return;

    panel.classList.add('open');

    document.getElementById('panel-title').textContent = film.title || 'Titolo';
    document.getElementById('panel-year').textContent = film.year || '-';
    document.getElementById('panel-director').textContent = film.director || '-';
    document.getElementById('panel-location').textContent = film.location || '-';
    document.getElementById('panel-inspiration').textContent = film.inspiration || '-';
    document.getElementById('panel-rating').textContent = film.character || 'Personaggio sconosciuto';

    const img = document.getElementById('panel-hero-img');
    if (img) {
        img.style.backgroundImage = film.filmImage ? `url(${film.filmImage})` : 'none';
    }

    console.log('📂 Pannello aperto:', film.title);
};

/* =========================
   ❌ CLOSE PANEL
========================= */
function closePanel() {
    document.getElementById('detail-panel')?.classList.remove('open');
}

/* =========================
   🎲 RANDOM
========================= */
function randomJourney() {
    const films = window.displayedFilms;
    if (!films?.length || !window.map) return;

    const film = films[Math.floor(Math.random() * films.length)];

    window.map.flyTo([film.lat, film.lng], 7, {
        animate: true,
        duration: 1.8,
        easeLinearity: 0.25
    });

    window.map.once('moveend', () => {
        window.UI.openPanel(film);
    });
}

/* =========================
   ▶️ START APP
========================= */
function startAtlas() {
    const landing = document.getElementById('landing-page');
    const atlas = document.getElementById('atlas-page');

    if (!landing || !atlas) return;

    landing.classList.add('animate__fadeOut');

    setTimeout(() => {
        landing.classList.add('hidden');
        atlas.classList.remove('hidden');
        atlas.classList.add('animate__fadeIn');

        if (!window.map) {
            window.map = initMap();
        }

        requestAnimationFrame(() => {
            window.map.invalidateSize();

            if (window.displayedFilms) {
                loadMarkers(window.displayedFilms);
            }
        });
    }, 500);
}

/* =========================
   ⚙️ INIT UI
========================= */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn')?.addEventListener('click', startAtlas);
    document.getElementById('close-panel')?.addEventListener('click', closePanel);
    document.getElementById('compass-btn')?.addEventListener('click', randomJourney);
});