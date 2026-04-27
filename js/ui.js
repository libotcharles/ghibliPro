window.UI = {};
window.currentFilm = null;

function typeText(element, text, speed = 18) {
    if (!element) return;

    text = String(text || '');

    element.textContent = '';
    element.classList.add('typing-text');

    let index = 0;

    const interval = setInterval(() => {
        element.textContent += text.charAt(index);
        index++;

        if (index >= text.length) {
            clearInterval(interval);
            element.classList.remove('typing-text');
        }
    }, speed);
}

window.UI.openPanel = function (film) {
    const overlay = document.getElementById('film-overlay');
    if (!overlay || !film) return;

    window.currentFilm = film;

    overlay.classList.remove('hidden');

    const imageUrl = film.filmImage || '';

    document.getElementById('overlay-title').textContent = film.title || 'Titolo del film';

    const overlayYear = document.getElementById('overlay-year');
    const overlayDirector = document.getElementById('overlay-director');
    const overlayRating = document.getElementById('overlay-rating');
    const overlayDuration = document.getElementById('overlay-duration');

    if (overlayYear) overlayYear.textContent = film.year || film.release_date || '-';
    if (overlayDirector) overlayDirector.textContent = film.director || '-';
    if (overlayRating) overlayRating.textContent = film.rt_score || film.character || '-';
    if (overlayDuration) overlayDuration.textContent = film.duration || film.running_time || '-';

    const mainImg = document.getElementById('overlay-main-img');
    const leftImg = document.getElementById('overlay-left-img');
    const rightImg = document.getElementById('overlay-right-img');
    const previewImg = document.getElementById('preview-img');
    const previewOverlay = document.getElementById('image-preview-overlay');

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

    if (leftImg) leftImg.style.backgroundImage = 'none';
    if (rightImg) rightImg.style.backgroundImage = 'none';

    closeInfoPage();
};

function openInfoPage(event) {
    if (event) event.stopPropagation();

    const film = window.currentFilm;
    const infoPage = document.getElementById('film-info-page');

    if (!film || !infoPage) return;

    const imageUrl = film.filmImage || '';

    const title = film.title || 'Titolo del film';
    const description = film.description || film.inspiration || '-';
    const director = film.director || '-';
    const producer = film.producer || '-';
    const releaseDate = film.release_date || film.year || '-';
    const runningTime = film.running_time ? `${film.running_time} min` : (film.duration || '-');
    const rtScore = film.rt_score ? `${film.rt_score}%` : (film.rating || '-');

    const titleEl = document.getElementById('info-title');
    const descriptionEl = document.getElementById('info-description');
    const directorEl = document.getElementById('info-director');
    const producerEl = document.getElementById('info-producer');
    const releaseDateEl = document.getElementById('info-release-date');
    const runningTimeEl = document.getElementById('info-running-time');
    const rtScoreEl = document.getElementById('info-rt-score');

    if (titleEl) titleEl.textContent = title;

    if (descriptionEl) descriptionEl.textContent = '';
    if (directorEl) directorEl.textContent = '';
    if (producerEl) producerEl.textContent = '';
    if (releaseDateEl) releaseDateEl.textContent = '';
    if (runningTimeEl) runningTimeEl.textContent = '';
    if (rtScoreEl) rtScoreEl.textContent = '';

    const infoImage = document.getElementById('info-image');
    if (infoImage) {
        infoImage.src = imageUrl || '';
    }

    infoPage.classList.remove('hidden');

    infoPage.classList.remove('info-animate');
    void infoPage.offsetWidth;
    infoPage.classList.add('info-animate');

    const speed = 14;
    const descriptionDuration = description.length * speed;

    setTimeout(() => {
        typeText(descriptionEl, description, speed);
    }, 350);

    setTimeout(() => {
        typeText(directorEl, director, 22);
    }, 350 + descriptionDuration + 200);

    setTimeout(() => {
        typeText(producerEl, producer, 22);
    }, 350 + descriptionDuration + 350);

    setTimeout(() => {
        typeText(releaseDateEl, releaseDate, 22);
    }, 350 + descriptionDuration + 500);

    setTimeout(() => {
        typeText(runningTimeEl, runningTime, 22);
    }, 350 + descriptionDuration + 650);

    setTimeout(() => {
        typeText(rtScoreEl, rtScore, 22);
    }, 350 + descriptionDuration + 800);
}

function closeInfoPage(event) {
    if (event) event.stopPropagation();

    const infoPage = document.getElementById('film-info-page');
    if (infoPage) {
        infoPage.classList.add('hidden');
        infoPage.classList.remove('info-animate');
    }
}

function openImagePreview(event) {
    event.stopPropagation();

    const previewOverlay = document.getElementById('image-preview-overlay');
    if (!previewOverlay) return;

    previewOverlay.classList.remove('hidden');
}

function closeImagePreview(event) {
    if (event) event.stopPropagation();

    document.getElementById('image-preview-overlay')?.classList.add('hidden');
}

function closePanel() {
    document.getElementById('image-preview-overlay')?.classList.add('hidden');
    document.getElementById('film-info-page')?.classList.add('hidden');
    document.getElementById('film-overlay')?.classList.add('hidden');
    document.getElementById('detail-panel')?.classList.remove('open');
}

function randomJourney() {
    const films = window.displayedFilms;
    if (!films?.length) return;

    const film = films[Math.floor(Math.random() * films.length)];
    focusOnFilm(film);
}

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