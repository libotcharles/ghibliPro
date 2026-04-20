
window.UI = {};

/* =========================
   📂 OPEN PANEL
========================= */
window.UI.openPanel = function (film) {

    const panel = document.getElementById('detail-panel');
    if (!panel) return;

    panel.classList.add('open');

    document.getElementById('panel-title').textContent = film.title || 'Titolo';
    document.getElementById('panel-year').textContent = film.year || '-';
    document.getElementById('panel-director').textContent = film.director || '-';
    document.getElementById('panel-location').textContent = film.location || '-';
    document.getElementById('panel-inspiration').textContent = film.inspiration || '-';
    document.getElementById('panel-rating').textContent = `${film.character || 'Personaggio sconosciuto'}`;

    const img = document.getElementById('panel-hero-img');
    if (img && film.filmImage) {
        img.style.backgroundImage = `url(${film.filmImage})`;
    }

    console.log("📂 Pannello aperto:", film.title);
};

/* =========================
   ❌ CLOSE PANEL
========================= */
function closePanel() {
    document.getElementById('detail-panel')
        ?.classList.remove('open');
}

/* =========================
   🎲 RANDOM
========================= */
function randomJourney() {

    const films = window.displayedFilms;
    if (!films?.length) return;

    const film = films[Math.floor(Math.random() * films.length)];

    window.map.flyTo([film.lat, film.lng], 7, {
        duration: 2
    });

    setTimeout(() => window.UI.openPanel(film), 1000);
}

/* =========================
   ⚙️ INIT UI
========================= */
document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('start-btn')
        ?.addEventListener('click', () => {

            document.getElementById('landing-page').classList.add('hidden');
            document.getElementById('atlas-page').classList.remove('hidden');

            if (!window.map) {
                window.map = initMap();
            }

            window.map.invalidateSize();

            if (window.displayedFilms) {
                loadMarkers(window.displayedFilms);
            }
        });

    document.getElementById('close-panel')
        ?.addEventListener('click', closePanel);

    document.getElementById('compass-btn')
        ?.addEventListener('click', randomJourney);
});