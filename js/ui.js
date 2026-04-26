window.UI = {};
window.currentFilm = null;

/* =========================
   🎬 OPEN OVERLAY FILM
========================= */
window.UI.openPanel = function (film) {
    const overlay = document.getElementById('film-overlay');
    if (!overlay || !film) return;

    window.currentFilm = film;

    overlay.classList.remove('hidden');

    document.getElementById('overlay-title').textContent = film.title || 'Titolo del film';
    document.getElementById('overlay-year').textContent = film.year || film.release_date || '-';
    document.getElementById('overlay-director').textContent = film.director || '-';
    document.getElementById('overlay-rating').textContent = film.rt_score || film.character || '-';

    const duration = document.getElementById('overlay-duration');
    if (duration) {
        duration.textContent = film.duration || film.running_time || '-';
    }

    const mainImg = document.getElementById('overlay-main-img');
    const leftImg = document.getElementById('overlay-left-img');
    const rightImg = document.getElementById('overlay-right-img');
    const previewImg = document.getElementById('preview-img');
    const previewOverlay = document.getElementById('image-preview-overlay');

    const imageUrl = film.filmImage || '';

    if (mainImg) {
        mainImg.style.backgroundImage = imageUrl ? `url(${imageUrl})` : 'none';
        mainImg.style.backgroundSize = 'cover';
        mainImg.style.backgroundPosition = 'center';
        mainImg.style.backgroundRepeat = 'no-repeat';
    }

    if (previewImg) {
        previewImg.src = imageUrl || '';
    }

    if (previewOverlay) {
        previewOverlay.classList.add('hidden');
    }

    if (leftImg) {
        leftImg.style.backgroundImage = 'none';
    }

    if (rightImg) {
        rightImg.style.backgroundImage = 'none';
    }

    closeInfoPage();
};

/* =========================
   📖 OPEN INFO PAGE
========================= */
function openInfoPage(event) {
    if (event) event.stopPropagation();

    const film = window.currentFilm;
    const infoPage = document.getElementById('film-info-page');

    if (!film || !infoPage) return;

    const imageUrl = film.filmImage || '';

    document.getElementById('info-title').textContent = film.title || 'Titolo del film';
    document.getElementById('info-description').textContent = film.description || film.inspiration || '-';
    document.getElementById('info-director').textContent = film.director || '-';
    document.getElementById('info-producer').textContent = film.producer || '-';
    document.getElementById('info-release-date').textContent = film.release_date || film.year || '-';
    document.getElementById('info-running-time').textContent = film.running_time
        ? `${film.running_time} min`
        : (film.duration || '-');
    document.getElementById('info-rt-score').textContent = film.rt_score
        ? `${film.rt_score}%`
        : (film.rating || '-');

    const infoImage = document.getElementById('info-image');
    if (infoImage) {
        infoImage.src = imageUrl || '';
    }

    infoPage.classList.remove('hidden');
}

/* =========================
   📖 CLOSE INFO PAGE
========================= */
function closeInfoPage(event) {
    if (event) event.stopPropagation();

    document.getElementById('film-info-page')?.classList.add('hidden');
}

/* =========================
   🖼️ OPEN IMAGE PREVIEW
========================= */
function openImagePreview(event) {
    event.stopPropagation();

    const previewOverlay = document.getElementById('image-preview-overlay');
    if (!previewOverlay) return;

    previewOverlay.classList.remove('hidden');
}

/* =========================
   🖼️ CLOSE IMAGE PREVIEW
========================= */
function closeImagePreview(event) {
    if (event) {
        event.stopPropagation();
    }

    document.getElementById('image-preview-overlay')?.classList.add('hidden');
}

/* =========================
   ❌ CLOSE OVERLAY
========================= */
function closePanel() {
    document.getElementById('image-preview-overlay')?.classList.add('hidden');
    document.getElementById('film-info-page')?.classList.add('hidden');
    document.getElementById('film-overlay')?.classList.add('hidden');

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

    document.getElementById('overlay-main-img')?.addEventListener('click', openImagePreview);
    document.getElementById('image-preview-overlay')?.addEventListener('click', closeImagePreview);

    document.getElementById('open-info-page')?.addEventListener('click', openInfoPage);
    document.getElementById('film-info-close')?.addEventListener('click', closeInfoPage);

    document.getElementById('film-info-page')?.addEventListener('click', (event) => {
        if (event.target.id === 'film-info-page') {
            closeInfoPage(event);
        }
    });

    document.getElementById('film-overlay')?.addEventListener('click', (event) => {
        if (
            event.target.id === 'film-overlay' ||
            event.target.classList.contains('film-overlay-backdrop')
        ) {
            closePanel();
        }
    });
});