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
};

/* =========================
   ❌ CLOSE PANEL
========================= */
function closePanel() {
    document.getElementById('detail-panel')?.classList.remove('open');
}

/* =========================
   🎲 RANDOM JOURNEY
========================= */
function randomJourney() {
    const films = window.displayedFilms;
    if (!films?.length) return;

    const film = films[Math.floor(Math.random() * films.length)];
    focusOnFilm(film);
}

/* =========================
   🔍 SEARCH FILMS
========================= */
function handleSearch(event) {
    const query = event.target.value.trim().toLowerCase();

    if (!Array.isArray(window.filmsData)) return;

    if (!query) {
        window.displayedFilms = [...window.filmsData];
        loadMarkers(window.displayedFilms);
        fitMapToMarkers();
        return;
    }

    window.displayedFilms = window.filmsData.filter((film) => {
        const title = (film.title || '').toLowerCase();
        const director = (film.director || '').toLowerCase();
        const location = (film.location || '').toLowerCase();

        return (
            title.includes(query) ||
            director.includes(query) ||
            location.includes(query)
        );
    });

    loadMarkers(window.displayedFilms);

    if (window.displayedFilms.length) {
        fitMapToMarkers();
    } else {
        closePanel();
    }
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
            initMap();
        }

        if (!Array.isArray(window.displayedFilms) && Array.isArray(window.filmsData)) {
            window.displayedFilms = [...window.filmsData];
        }

        requestAnimationFrame(() => {
            window.map.invalidateSize();

            if (window.displayedFilms?.length) {
                loadMarkers(window.displayedFilms);
                fitMapToMarkers();
            }
        });
    }, 500);
}

/* =========================
   ⚙️ INIT UI
========================= */
document.addEventListener('DOMContentLoaded', () => {
    if (Array.isArray(window.filmsData) && !Array.isArray(window.displayedFilms)) {
        window.displayedFilms = [...window.filmsData];
    }

    document.getElementById('start-btn')?.addEventListener('click', startAtlas);
    document.getElementById('close-panel')?.addEventListener('click', closePanel);
    document.getElementById('compass-btn')?.addEventListener('click', randomJourney);
    document.getElementById('fit-all-btn')?.addEventListener('click', () => fitMapToMarkers());
    document.getElementById('toggle-style-btn')?.addEventListener('click', cycleMapStyle);
    document.getElementById('search-input')?.addEventListener('input', handleSearch);
});