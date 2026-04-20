
async function fetchData() {
    try {
        const res = await fetch('data-locations.json');
        const data = await res.json();

        window.displayedFilms = data.locations;

        if (window.map) {
            loadMarkers(window.displayedFilms);
        }

        console.log("✅ Dati caricati:", window.displayedFilms.length, "film");
    } catch (error) {
        console.error("❌ Errore caricamento dati:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchData);