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

    // Initialize snowflakes
    function createSnowflakes() {
        const snowflakesContainer = document.getElementById('snowflakesContainer');
        const snowflakeSymbols = ['❄', '❅', '❆', '*', '•'];
        
        for (let i = 0; i < 50; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 10 + 's';
            snowflake.style.opacity = Math.random() * 0.7 + 0.3;
            snowflake.style.fontSize = (Math.random() * 8 + 12) + 'px';
            snowflakesContainer.appendChild(snowflake);
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
        
        // Initialize map
        initMap();
        
        // Start background music automatically
        startBackgroundMusic();
        
        // Start countdown
        startCountdown();
        
        // Initialize animations
        initAnimations();
    }

    // Initialize map with Leaflet
    function initMap() {
        const map = L.map('map').setView([2.7416459, 98.7095258], 15);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        
        // Add custom marker
        const customIcon = L.divIcon({
            html: '<div style="background: #D4523F; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;"><i class="fas fa-map-marker-alt" style="color: white; font-size: 14px;"></i></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30]
        });
        
        const marker = L.marker([2.7416459, 98.7095258], { icon: customIcon }).addTo(map);
        
        marker.bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <h4 style="margin: 0 0 5px 0; color: #D4523F; font-weight: bold;">Labersa Hotel & Convention Center Samosir</h4>
                <p style="margin: 0; font-size: 12px; color: #666;">Jl. Raya Simanindo-Pangururan, Desa Simarmata, Kabupaten Samosir</p>
                <p style="margin: 5px 0 0 0; font-size: 11px; color: #888;">Kapasitas: 700 orang</p>
            </div>
        `).openPopup();
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
                window.open('https://www.google.com/maps/place/Labersa+Hotel+%26+Convention+Center+Samosir', '_blank');
            });
        } else {
            window.open('https://www.google.com/maps/place/Labersa+Hotel+%26+Convention+Center+Samosir', '_blank');
        }
    });

    // Start background music
    function startBackgroundMusic() {
        // Set music volume
        backgroundMusic.volume = 0.4;
        
        // Play music
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicUI(true);
        }).catch(error => {
            console.log("Autoplay prevented: ", error);
            // Show play button if autoplay is blocked
            document.getElementById('musicPlayer').style.display = 'flex';
        });
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
                    <div class="event-started">
                        <i class="fas fa-gift"></i>
                        <h3>Acara Sedang Berlangsung!</h3>
                        <p>Selamat Menikmati Perayaan Natal</p>
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
        const sections = document.querySelectorAll('.header, .hero, .detail-card, .map-section, .info-card, .countdown, .footer');
        
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
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
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            ornament.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Initialize cover page
    function initCoverPage() {
        // Create snowflakes for cover
        const coverSnowflakes = document.querySelector('.cover-snowflakes');
        const snowflakeSymbols = ['❄', '❅', '❆', '*', '•'];
        
        for (let i = 0; i < 30; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 8 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 10 + 's';
            snowflake.style.opacity = Math.random() * 0.5 + 0.2;
            snowflake.style.fontSize = (Math.random() * 8 + 12) + 'px';
            coverSnowflakes.appendChild(snowflake);
        }
        
        // Ensure elements are properly hidden initially
        popupOverlay.style.display = 'none';
        mainContent.style.display = 'none';
        coverPage.style.display = 'flex';
        
        // Make cover page scrollable
        document.body.style.overflow = 'auto';
    }

    // Initialize the cover page
    initCoverPage();
});
