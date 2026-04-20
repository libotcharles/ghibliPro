// 🖼️ COMPARISON SLIDER - Before/After con barra verticale

class ComparisonSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`❌ Elemento ${containerId} non trovato`);
            return;
        }

        this.isDragging = false;
        this.init();
    }

    init() {
        // Struttura HTML
        this.container.innerHTML = `
            <div class="comparison-wrapper">
                <!-- Immagine Before (Reale) -->
                <div class="comparison-img before">
                    <img id="comparison-before" src="" alt="Luogo reale">
                    <span class="label">Realtà</span>
                </div>

                <!-- Immagine After (Film) con overlay -->
                <div class="comparison-img after" id="comparison-overlay">
                    <img id="comparison-after" src="" alt="Scena film">
                    <span class="label">Film</span>
                </div>

                <!-- Barra di separazione verticale (draggable) -->
                <div class="comparison-slider" id="comparison-slider">
                    <div class="slider-handle">
                        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <!-- Icona frecce sinistra-destra -->
                            <circle cx="20" cy="20" r="18" fill="white" stroke="#6b8e7f" stroke-width="2"/>
                            <path d="M14 20 L10 16" stroke="#6b8e7f" stroke-width="2" stroke-linecap="round"/>
                            <path d="M14 20 L10 24" stroke="#6b8e7f" stroke-width="2" stroke-linecap="round"/>
                            <path d="M26 20 L30 16" stroke="#6b8e7f" stroke-width="2" stroke-linecap="round"/>
                            <path d="M26 20 L30 24" stroke="#6b8e7f" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                </div>
            </div>
        `;

        this.slider = this.container.querySelector('#comparison-slider');
        this.overlay = this.container.querySelector('#comparison-overlay');
        this.wrapper = this.container.querySelector('.comparison-wrapper');

        // Event listeners
        this.slider.addEventListener('mousedown', () => this.startDrag());
        this.slider.addEventListener('touchstart', () => this.startDrag());
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.stopDrag());
        document.addEventListener('touchend', () => this.stopDrag());

        // Click su wrapper per spostare slider
        this.wrapper.addEventListener('click', (e) => this.handleClick(e));

        // Inizializza a 50%
        this.updateSliderPosition(50);

        console.log('✅ Comparison Slider inizializzato');
    }

    startDrag() {
        this.isDragging = true;
        this.container.classList.add('dragging');
    }

    stopDrag() {
        this.isDragging = false;
        this.container.classList.remove('dragging');
    }

    drag(e) {
        if (!this.isDragging) return;

        const { left, width } = this.wrapper.getBoundingClientRect();
        const x = (e.clientX || e.touches?.[0].clientX) - left;
        const percentage = Math.max(0, Math.min(100, (x / width) * 100));

        this.updateSliderPosition(percentage);
    }

    handleClick(e) {
        if (e.target === this.slider || this.slider.contains(e.target)) return;

        const { left, width } = this.wrapper.getBoundingClientRect();
        const x = e.clientX - left;
        const percentage = Math.max(0, Math.min(100, (x / width) * 100));

        this.updateSliderPosition(percentage);
    }

    updateSliderPosition(percentage) {
        this.slider.style.left = percentage + '%';
        this.overlay.style.width = percentage + '%';
    }

    setImages(beforeSrc, afterSrc) {
        const beforeImg = this.container.querySelector('#comparison-before');
        const afterImg = this.container.querySelector('#comparison-after');

        if (beforeImg) beforeImg.src = beforeSrc;
        if (afterImg) afterImg.src = afterSrc;
    }
}

// Export per uso globale
window.ComparisonSlider = ComparisonSlider;
