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

    let isMusicPlaying = false;

    // Fungsi untuk membuka popup
    function openPopup() {
        popupOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Mencegah scroll di body
    }

    // Fungsi untuk menutup popup dan menampilkan halaman utama
    function closePopup() {
        popupOverlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Mengembalikan scroll
        coverPage.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Mulai musik setelah popup ditutup
        startBackgroundMusic();
        // Mulai countdown
        startCountdown();
        // Inisialisasi animasi
        initAnimations();
    }

    // Event listener untuk tombol "Buka Undangan"
    openInvitationBtn.addEventListener('click', function() {
        // Tambahkan efek klik
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
        
        // Tampilkan popup
        openPopup();
    });

    // Event listener untuk tombol close popup
    closePopupBtn.addEventListener('click', closePopup);

    // Event listener untuk menutup popup dengan menekan di luar gambar
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });

    // Fungsi untuk memulai musik
    function startBackgroundMusic() {
        backgroundMusic.volume = 0.5;
        backgroundMusic.play().then(() => {
            isMusicPlaying = true;
            updateMusicUI(true);
        }).catch(error => {
            console.log("Autoplay prevented: ", error);
            // Tampilkan tombol play
            musicToggle.style.display = 'flex';
        });
    }

    // Fungsi untuk update UI musik
    function updateMusicUI(playing) {
        if (playing) {
            musicIcon.className = 'fas fa-pause';
            musicText.textContent = 'Jeda Musik';
        } else {
            musicIcon.className = 'fas fa-play';
            musicText.textContent = 'Putar Musik';
        }
    }

    // Event listener untuk toggle musik
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

    // Fungsi untuk countdown
    function startCountdown() {
        const eventDate = new Date('December 20, 2025 15:00:00').getTime();
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = eventDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

            if (distance < 0) {
                clearInterval(countdownTimer);
                document.getElementById('countdown').innerHTML = '<div class="event-ended">Acara telah dimulai!</div>';
            }
        }

        updateCountdown();
        const countdownTimer = setInterval(updateCountdown, 1000);
    }

    // Fungsi untuk animasi
    function initAnimations() {
        const elements = document.querySelectorAll('.luxury-card, .section-title');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Inisialisasi awal: sembunyikan popup dan halaman utama
    popupOverlay.style.display = 'none';
    mainContent.style.display = 'none';
});
