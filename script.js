// Enhanced Luxury Loading Screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Initialize animations after loading
            initAnimations();
        }, 800);
    }, 3000);
});

// Initialize animations
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

// Enhanced Countdown Timer
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

// Enhanced Music Player with Auto-play
const musicToggle = document.getElementById('musicToggle');
const backgroundMusic = document.getElementById('backgroundMusic');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.querySelector('.music-text');
const visualizer = document.querySelector('.music-visualizer');
let isPlaying = false;

// Auto-play music after user interaction
document.addEventListener('click', function initAudio() {
    if (!isPlaying) {
        playMusic();
    }
    document.removeEventListener('click', initAudio);
}, { once: true });

function playMusic() {
    backgroundMusic.volume = 0.5;
    backgroundMusic.play().then(() => {
        isPlaying = true;
        musicIcon.className = 'fas fa-pause';
        musicText.textContent = 'Jeda Musik';
        visualizer.classList.add('active');
        
        // Add celebration effect when music starts
        createCelebrationEffect();
    }).catch(error => {
        console.log("Autoplay prevented: ", error);
        // Show play button if autoplay is blocked
        musicToggle.style.display = 'flex';
    });
}

function pauseMusic() {
    backgroundMusic.pause();
    isPlaying = false;
    musicIcon.className = 'fas fa-play';
    musicText.textContent = 'Putar Musik';
    visualizer.classList.remove('active');
}

musicToggle.addEventListener('click', function() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

// Enhanced Map Interaction
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

// Create snowflakes dynamically
function createSnowflakes() {
    const snowflakesContainer = document.querySelector('.snowflakes');
    const snowflakeSymbols = ['❅', '❆', '❄'];
    
    // Clear existing snowflakes
    snowflakesContainer.innerHTML = '';
    
    // Create more snowflakes
    for (let i = 0; i < 20; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.textContent = snowflakeSymbols[Math.floor(Math.random() * snowflakeSymbols.length)];
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = (Math.random() * 5 + 5) + 's';
        snowflake.style.animationDelay = Math.random() * 10 + 's';
        snowflake.style.opacity = Math.random() * 0.7 + 0.3;
        snowflakesContainer.appendChild(snowflake);
    }
}

createSnowflakes();

// Celebration effect when music starts
function createCelebrationEffect() {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            createConfetti();
        }, i * 100);
    }
}

// Enhanced confetti effect
function createConfetti() {
    const colors = ['#b30000', '#d4af37', '#ffffff', '#ffd700', '#8b0000'];
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
    const parallaxElements = document.querySelectorAll('.batak-ornament, .christmas-ornament');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.luxury-card, .section-title').forEach(element => {
    element.classList.add('animate-on-scroll');
    observer.observe(element);
});

// Add Christmas tree decoration
function addChristmasTree() {
    const tree = document.createElement('div');
    tree.className = 'christmas-tree';
    tree.innerHTML = `
        <div class="tree-top"></div>
        <div class="tree-middle"></div>
        <div class="tree-bottom"></div>
        <div class="tree-trunk"></div>
        <div class="tree-ornament ornament-1"></div>
        <div class="tree-ornament ornament-2"></div>
        <div class="tree-ornament ornament-3"></div>
        <div class="tree-star"></div>
    `;
    document.querySelector('.background-elements').appendChild(tree);
}

// Initialize Christmas tree
setTimeout(addChristmasTree, 1000);

// Add custom cursor effect
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Create custom cursor
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    .custom-cursor {
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
    }
    
    .christmas-tree {
        position: fixed;
        bottom: -50px;
        right: 50px;
        z-index: -1;
        opacity: 0.1;
    }
    
    @media (max-width: 768px) {
        .custom-cursor {
            display: none;
        }
    }
`;
document.head.appendChild(cursorStyle);
