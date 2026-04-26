window.UI = {};

/* =========================
   🎬 OPEN OVERLAY FILM
========================= */
window.UI.openPanel = function (film) {
    const overlay = document.getElementById('film-overlay');
    if (!overlay || !film) return;

    overlay.classList.remove('hidden');

    document.getElementById('overlay-title').textContent = film.title || 'Titolo del film';
    document.getElementById('overlay-year').textContent = film.year || '-';
    document.getElementById('overlay-director').textContent = film.director || '-';
    document.getElementById('overlay-rating').textContent = film.character || '-';

    const duration = document.getElementById('overlay-duration');
    if (duration) {
        duration.textContent = film.duration || '-';
    }

    const mainImg = document.getElementById('overlay-main-img');
    const leftImg = document.getElementById('overlay-left-img');
    const rightImg = document.getElementById('overlay-right-img');

    const imageUrl = film.filmImage || '';

    /* immagine SOLO nel rettangolo sopra */
    if (mainImg) {
        mainImg.style.backgroundImage = imageUrl ? `url(${imageUrl})` : 'none';
        mainImg.style.backgroundSize = 'cover';
        mainImg.style.backgroundPosition = 'center';
        mainImg.style.backgroundRepeat = 'no-repeat';
    }

    /* rettangoli laterali vuoti */
    if (leftImg) {
        leftImg.style.backgroundImage = 'none';
    }

    if (rightImg) {
        rightImg.style.backgroundImage = 'none';
    }
};

/* =========================
   ❌ CLOSE OVERLAY
========================= */
function closePanel() {
    document.getElementById('film-overlay')?.classList.add('hidden');

    /* chiude anche il vecchio pannello, nel caso fosse aperto */
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
    document.getElementById('film-overlay-close')?.addEventListener('click', closePanel);
    document.getElementById('close-panel')?.addEventListener('click', closePanel);
    document.getElementById('compass-btn')?.addEventListener('click', randomJourney);
    document.getElementById('search-input')?.addEventListener('input', handleSearch);

    document.getElementById('film-overlay')?.addEventListener('click', (event) => {
        if (
            event.target.id === 'film-overlay' ||
            event.target.classList.contains('film-overlay-backdrop')
        ) {
            closePanel();
        }
    });
});