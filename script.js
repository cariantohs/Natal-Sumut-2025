// Cover Page Functionality - FIXED VERSION
document.addEventListener('DOMContentLoaded', function() {
    const coverPage = document.getElementById('coverPage');
    const openInvitationBtn = document.getElementById('openInvitation');
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    const backgroundMusic = document.getElementById('backgroundMusic');

    // Initialize cover page
    function initializeCoverPage() {
        // Generate snowflakes for cover page
        generateCoverSnowflakes();
        
        // Add entrance animation to cover elements
        const coverElements = document.querySelectorAll('.cover-logo, .cover-invitation-text, .cover-details, .cover-to, .cover-button');
        coverElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300 + (index * 100));
        });
        
        // Ensure elements are properly hidden initially
        loadingScreen.style.display = 'none';
        mainContent.style.display = 'none';
        coverPage.style.display = 'flex';
    }

    // Generate snowflakes for cover page
    function generateCoverSnowflakes() {
        const snowflakesContainer = document.querySelector('.cover-snowflakes');
        const snowflakeSymbols = ['❅', '❆', '❄', '❉', '❋'];
        
        // Clear existing snowflakes
        snowflakesContainer.innerHTML = '';
        
        // Create 80 snowflakes for cover (more snow!)
        for (let i = 0; i < 80; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'cover-snowflake';
            snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 8 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 10 + 's';
            snowflake.style.opacity = Math.random() * 0.8 + 0.2;
            snowflake.style.fontSize = (Math.random() * 10 + 14) + 'px';
            snowflakesContainer.appendChild(snowflake);
        }
    }

    // Generate snowflakes for main content
    function generateMainSnowflakes() {
        const snowflakesContainer = document.getElementById('snowflakesContainer');
        const snowflakeSymbols = ['❅', '❆', '❄', '❉', '❋'];
        
        // Clear existing snowflakes
        snowflakesContainer.innerHTML = '';
        
        // Create 120 snowflakes for main content (even more snow!)
        for (let i = 0; i < 120; i++) {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
            snowflake.style.left = Math.random() * 100 + 'vw';
            snowflake.style.animationDuration = (Math.random() * 10 + 5) + 's';
            snowflake.style.animationDelay = Math.random() * 15 + 's';
            snowflake.style.opacity = Math.random() * 0.7 + 0.3;
            snowflake.style.fontSize = (Math.random() * 8 + 12) + 'px';
            snowflakesContainer.appendChild(snowflake);
        }
    }

    // Open invitation function - FIXED
    openInvitationBtn.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        
        // Show loading screen
        coverPage.style.display = 'none';
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
        
        // Simulate loading time
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                mainContent.style.display = 'block';
                
                // Initialize main content
                initMainContent();
            }, 800);
        }, 2500);
    });

    // Initialize main content
    function initMainContent() {
        // Generate snowflakes for main content
        generateMainSnowflakes();
        
        // Initialize animations
        initAnimations();
        
        // Start background music automatically
        startBackgroundMusic();
        
        // Start countdown
        startCountdown();
    }

    // Start background music
    function startBackgroundMusic() {
        // Set music volume
        backgroundMusic.volume = 0.4;
        
        // Play music
        backgroundMusic.play().then(() => {
            console.log("Music started automatically");
            updateMusicUI(true);
        }).catch(error => {
            console.log("Autoplay prevented: ", error);
            // Show play button if autoplay is blocked
            document.getElementById('musicPlayer').style.display = 'flex';
        });
    }

    // Update music UI
    function updateMusicUI(isPlaying) {
        const musicIcon = document.getElementById('musicIcon');
        const musicText = document.querySelector('.music-text');
        const visualizer = document.querySelector('.music-visualizer');
        
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
    const musicToggle = document.getElementById('musicToggle');
    let isMusicPlaying = true;

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
                element.style.color = '#ffd700';
                
                setTimeout(() => {
                    element.textContent = newValue;
                    element.style.transform = 'scale(1)';
                    element.style.color = '#d4af37';
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

    // Map Interaction
    const mapPlaceholder = document.getElementById('mapPlaceholder');
    const mapLink = document.getElementById('mapLink');

    mapPlaceholder.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            mapLink.click();
        }, 150);
    });

    // Celebration effect
    function createCelebrationEffect() {
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createConfetti();
            }, i * 100);
        }
    }

    // Enhanced confetti effect
    function createConfetti() {
        const colors = ['#b30000', '#d4af37', '#ffffff', '#ffd700', '#8b0000', '#1a7a4c'];
        const confettiCount = 30;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }
    }

    // Add CSS for confetti
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        .confetti {
            position: fixed;
            top: -10px;
            width: 8px;
            height: 8px;
            opacity: 0.8;
            animation: fall linear forwards;
            z-index: 9999;
            pointer-events: none;
        }
        
        @keyframes fall {
            to {
                transform: translateY(100vh) rotate(360deg);
                opacity: 0;
            }
        }
        
        .event-started {
            text-align: center;
            color: var(--gold);
            padding: 40px;
        }
        
        .event-started i {
            font-size: 4rem;
            margin-bottom: 20px;
            display: block;
        }
        
        .event-started h3 {
            font-size: 2rem;
            margin-bottom: 15px;
        }
        
        .event-started p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
    `;
    document.head.appendChild(confettiStyle);

    // Parallax effect for background elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.batak-ornament, .christmas-ornament, .bg-image');
        
        parallaxElements.forEach(element => {
            const speed = 0.3;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add interactive ornament clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.christmas-ornament') || e.target.closest('.batak-ornament')) {
            createConfetti();
        }
    });

    // Initialize the cover page
    initializeCoverPage();
});
