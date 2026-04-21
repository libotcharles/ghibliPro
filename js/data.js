
async function fetchData() {
    try {
        // Fetch dall'API Studio Ghibli ufficiale
        const ghibliRes = await fetch('https://ghibliapi.vercel.app/films');
        const ghibliFilms = await ghibliRes.json();

        // Fetch dalle locazioni locali
        const locationsRes = await fetch('data-locations.json');
        const locationsData = await locationsRes.json();

        // Crea una mappa delle locazioni usando il titolo (case-insensitive)
        const locationsMap = {};
        locationsData.locations.forEach(loc => {
            locationsMap[loc.title.toLowerCase()] = loc;
        });

        // Unisci i dati: API Ghibli + locazioni locali
        window.displayedFilms = ghibliFilms
            .map(film => {
                // Prova a matchare per titolo
                const locationData = locationsMap[film.title.toLowerCase()];
                
                // Se esiste una locazione per questo film, unisci i dati
                if (locationData) {
                    return {
                        ...film,
                        lat: locationData.lat,
                        lng: locationData.lng,
                        location: locationData.location,
                        inspiration: locationData.inspiration,
                        realImage: locationData.realImage,
                        filmImage: locationData.filmImage,
                        marker: locationData.marker,
                        character: locationData.character
                    };
                }
                return null; // Scarta i film senza locazione
            })
            .filter(film => film !== null); // Rimuovi i null

        if (window.map) {
            loadMarkers(window.displayedFilms);
        }

        console.log("✅ Dati caricati da API:", window.displayedFilms.length, "film con locazioni");
    } catch (error) {
        console.error("❌ Errore caricamento dati:", error);
    }
}

document.addEventListener('DOMContentLoaded', fetchData);