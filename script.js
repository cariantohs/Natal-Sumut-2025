// Cover Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    const coverPage = document.getElementById('coverPage');
    const openInvitationBtn = document.getElementById('openInvitation');
    const mainContent = document.getElementById('mainContent');
    const popupOverlay = document.getElementById('popupOverlay');
    const closePopupBtn = document.getElementById('closePopup');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const musicToggle = document.getElementById('musicToggle');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.querySelector('.music-text');
    const visualizer = document.getElementById('visualizer');
    const getDirectionsBtn = document.getElementById('getDirections');
    let isMusicPlaying = false;
    let mapInitialized = false;
    let map;

    // Initialize snowflakes
    function createSnowflakes() {
        const snowflakesContainer = document.getElementById('snowflakesContainer');
        const snowflakeSymbols = ['❄', '❅', '❆', '❉', '❋', '✨', '⭐', '🌟'];
        
        // Clear existing snowflakes
        snowflakesContainer.innerHTML = '';
        
        // Create 150 snowflakes (lebih banyak!)
        for (let i = 0; i < 150; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 12 + 6) + 's';
            snowflake.style.animationDelay = Math.random() * 15 + 's';
            snowflake.style.opacity = Math.random() * 0.8 + 0.2;
            snowflake.style.fontSize = (Math.random() * 15 + 20) + 'px';
            snowflake.style.zIndex = '9999';
            snowflakesContainer.appendChild(snowflake);
        }
    }

    // Create snowflakes for cover page
    function createCoverSnowflakes() {
        const coverSnowflakes = document.querySelector('.cover-snowflakes');
        const snowflakeSymbols = ['❄', '❅', '❆', '❉', '❋', '✨'];
        
        // Clear existing snowflakes
        coverSnowflakes.innerHTML = '';
        
        // Create 80 snowflakes for cover
        for (let i = 0; i < 80; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 10 + 's';
            snowflake.style.opacity = Math.random() * 0.6 + 0.2;
            snowflake.style.fontSize = (Math.random() * 12 + 15) + 'px';
            snowflake.style.zIndex = '9999';
            coverSnowflakes.appendChild(snowflake);
        }
    }

    // Open invitation function
    openInvitationBtn.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        
        // Directly show popup without loading screen
        coverPage.style.display = 'none';
        popupOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Reset button animation
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });

    // Close popup function
    function closePopup() {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        mainContent.style.display = 'block';
        
        // Initialize main content
        initMainContent();
    }

    closePopupBtn.addEventListener('click', closePopup);

    // Close popup when clicking outside the image
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });

    // Initialize main content
    function initMainContent() {
        // Create snowflakes
        createSnowflakes();
        
        // Start background music automatically
        startBackgroundMusic();
        
        // Start countdown
        startCountdown();
        
        // Initialize animations
        initAnimations();
        
        // Initialize map when user scrolls near it
        setupMapLazyLoad();
    }

    // Lazy load map
    function setupMapLazyLoad() {
        const mapSection = document.querySelector('.map-section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !mapInitialized) {
                    initMap();
                    mapInitialized = true;
                    observer.unobserve(mapSection);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '100px'
        });
        
        if (mapSection) {
            observer.observe(mapSection);
        }
    }

    // Initialize map with Leaflet
    function initMap() {
        try {
            map = L.map('map').setView([2.7416459, 98.7095258], 16);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(map);
            
            // Add custom marker
            const customIcon = L.divIcon({
                html: '<div style="background: #D4523F; width: 40px; height: 40px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 15px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; animation: pulse 2s infinite;"><i class="fas fa-map-marker-alt" style="color: white; font-size: 18px;"></i></div>',
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });
            
            const marker = L.marker([2.7416459, 98.7095258], { icon: customIcon }).addTo(map);
            
            marker.bindPopup(`
                <div style="text-align: center; padding: 15px; min-width: 250px;">
                    <h4 style="margin: 0 0 10px 0; color: #D4523F; font-weight: bold; font-family: Cinzel, serif;">Labersa Hotel & Convention Center Samosir</h4>
                    <p style="margin: 0; font-size: 13px; color: #666; line-height: 1.4;">Jl. Raya Simanindo-Pangururan, Desa Simarmata, Kabupaten Samosir</p>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #888;">Kapasitas: 700 orang</p>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
                        <button onclick="window.open('https://www.google.com/maps/place/Labersa+Hotel+%26+Convention+Center+Samosir,+Simarmata/@2.7416513,98.7069509,17z/data=!4m9!3m8!1s0x3031c70074a74af3:0x6fd34e6bdf43b7af!5m2!4m1!1i2!8m2!3d2.7416459!4d98.7095258!16s%2Fg%2F11y5sk_61h?entry=ttu', '_blank')" style="background: #D4523F; color: white; border: none; padding: 8px 15px; border-radius: 20px; cursor: pointer; font-size: 12px; margin-top: 5px;">
                            <i class="fas fa-external-link-alt"></i> Buka di Google Maps
                        </button>
                    </div>
                </div>
            `).openPopup();
            
            // Add CSS for pulse animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 4px 15px rgba(212, 82, 63, 0.4); }
                    50% { transform: scale(1.1); box-shadow: 0 4px 20px rgba(212, 82, 63, 0.6); }
                    100% { transform: scale(1); box-shadow: 0 4px 15px rgba(212, 82, 63, 0.4); }
                }
            `;
            document.head.appendChild(style);
            
        } catch (error) {
            console.error('Error initializing map:', error);
            document.getElementById('map').innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 60px; color: #D4523F; margin-bottom: 20px;"></i>
                    <h4 style="color: #D4523F; margin-bottom: 10px;">Labersa Hotel & Convention Center Samosir</h4>
                    <p style="color: #666; margin-bottom: 5px;">Jl. Raya Simanindo-Pangururan, Desa Simarmata</p>
                    <p style="color: #888; margin-bottom: 20px;">Kabupaten Samosir</p>
                    <a href="https://www.google.com/maps/place/Labersa+Hotel+%26+Convention+Center+Samosir,+Simarmata/@2.7416513,98.7069509,17z/data=!4m9!3m8!1s0x3031c70074a74af3:0x6fd34e6bdf43b7af!5m2!4m1!1i2!8m2!3d2.7416459!4d98.7095258!16s%2Fg%2F11y5sk_61h?entry=ttu" 
                       target="_blank" style="background: #D4523F; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; display: inline-flex; align-items: center; gap: 10px;">
                        <i class="fas fa-external-link-alt"></i> Buka di Google Maps
                    </a>
                </div>
            `;
        }
    }

    // Get directions button
    getDirectionsBtn.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                const destination = '2.7416459,98.7095258';
                
                // Open Google Maps with directions
                window.open(`https://www.google.com/maps/dir/${userLat},${userLng}/${destination}`, '_blank');
            }, function(error) {
                // If user denies location access, open just the destination
                window.open('https://www.google.com/maps/place/Labersa+Hotel+%26+Convention+Center+Samosir/@2.7416459,98.7095258,17z', '_blank');
            });
        } else {
            window.open('https://www.google.com/maps/place/Labersa+Hotel+%26+Convention+Center+Samosir/@2.7416459,98.7095258,17z', '_blank');
        }
    });

    // Start background music
    function startBackgroundMusic() {
        // Set music volume
        backgroundMusic.volume = 0.3;
        
        // Play music
        const playPromise = backgroundMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isMusicPlaying = true;
                updateMusicUI(true);
            }).catch(error => {
                console.log("Autoplay prevented: ", error);
                // Show play button if autoplay is blocked
                document.getElementById('musicPlayer').style.display = 'flex';
            });
        }
    }

    // Update music UI
    function updateMusicUI(isPlaying) {
        if (isPlaying) {
            musicIcon.className = 'fas fa-pause';
            musicText.textContent = 'Jeda Musik';
            visualizer.classList.add('active');
        } else {
            musicIcon.className = 'fas fa-play';
            musicText.textContent = 'Putar Musik';
            visualizer.classList.remove('active');
        }
    }

    // Music toggle functionality
    musicToggle.addEventListener('click', function() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            isMusicPlaying = false;
            updateMusicUI(false);
        } else {
            backgroundMusic.play();
            isMusicPlaying = true;
            updateMusicUI(true);
        }
    });

    // Enhanced Countdown Timer
    function startCountdown() {
        function updateCountdown() {
            const eventDate = new Date('December 20, 2025 15:00:00').getTime();
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Add animation to countdown numbers
            animateCountdown('days', days.toString().padStart(2, '0'));
            animateCountdown('hours', hours.toString().padStart(2, '0'));
            animateCountdown('minutes', minutes.toString().padStart(2, '0'));
            animateCountdown('seconds', seconds.toString().padStart(2, '0'));

            if (distance < 0) {
                clearInterval(countdownTimer);
                document.getElementById('countdown').innerHTML = `
                    <div class="event-started" style="text-align: center; padding: 40px;">
                        <i class="fas fa-gift" style="font-size: 4rem; color: #C19D60; margin-bottom: 20px; display: block;"></i>
                        <h3 style="color: white; font-size: 2.5rem; margin-bottom: 15px; font-family: Cinzel, serif;">Acara Sedang Berlangsung!</h3>
                        <p style="color: #C19D60; font-size: 1.5rem;">Selamat Menikmati Perayaan Natal</p>
                    </div>
                `;
            }
        }

        function animateCountdown(elementId, newValue) {
            const element = document.getElementById(elementId);
            if (element.textContent !== newValue) {
                element.style.transform = 'scale(1.2)';
                element.style.color = '#C19D60';
                
                setTimeout(() => {
                    element.textContent = newValue;
                    element.style.transform = 'scale(1)';
                    element.style.color = '#FFFFFF';
                }, 150);
            }
        }

        const countdownTimer = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // Initialize animations for main content
    function initAnimations() {
        // Add entrance animations to all sections
        const sections = document.querySelectorAll('.header-logos, .header, .hero, .detail-card, .rundown-card, .map-section, .info-card, .countdown, .footer');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(40px)';
            section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }

    // Parallax effect for ornaments
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const ornaments = document.querySelectorAll('.ornament');
        
        ornaments.forEach(ornament => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            ornament.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Initialize cover page
    function initCoverPage() {
        // Create snowflakes for cover
        createCoverSnowflakes();
        
        // Ensure elements are properly hidden initially
        popupOverlay.style.display = 'none';
        mainContent.style.display = 'none';
        coverPage.style.display = 'flex';
        
        // Make cover page scrollable
        document.body.style.overflow = 'auto';
        
        // Add entrance animation to cover elements
        const coverElements = document.querySelectorAll('.cover-header, .cover-body');
        coverElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    }

    // Initialize the cover page
    initCoverPage();

    // Handle image loading errors
    window.addEventListener('error', function(e) {
        if (e.target.tagName === 'IMG') {
            console.warn('Image failed to load:', e.target.src);
            e.target.style.display = 'none';
        }
    }, true);

    // Handle popup image loading
    const popupImage = document.getElementById('popupImage');
    if (popupImage) {
        popupImage.onerror = function() {
            this.style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = `
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: white;
                text-align: center;
                padding: 20px;
            `;
            errorDiv.innerHTML = `
                <i class="fas fa-image" style="font-size: 4rem; color: #D4523F; margin-bottom: 20px;"></i>
                <h3 style="color: white; margin-bottom: 10px;">Selamat Datang di Perayaan Natal 2025</h3>
                <p style="color: #C19D60; margin-bottom: 20px;">Keluarga Besar BPS Sumatera Utara</p>
                <p style="color: #D4523F; font-style: italic;">"Allah Hadir untuk Menyelamatkan Keluarga" - Matius 1:21-24</p>
                <button onclick="closePopup()" style="margin-top: 30px; background: #D4523F; color: white; border: none; padding: 15px 40px; border-radius: 25px; font-size: 1.1rem; cursor: pointer;">
                    Lanjutkan ke Undangan
                </button>
            `;
            this.parentNode.appendChild(errorDiv);
        };
    }
});

// Make closePopup function globally available
function closePopup() {
    const popupOverlay = document.getElementById('popupOverlay');
    const mainContent = document.getElementById('mainContent');
    
    if (popupOverlay) popupOverlay.style.display = 'none';
    if (mainContent) mainContent.style.display = 'block';
    
    document.body.style.overflow = 'auto';
}
