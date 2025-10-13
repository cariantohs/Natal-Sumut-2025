// Google Sheets Configuration
const SHEET_ID = '10G7c_jfQ9_wr8wjs3BnOgcCn4DDeomJFrKEgkCT3ZZ8';
const API_KEY = 'AIzaSyAB28UliPqPfO27zWdcKsI39DMWVcwryiY'; // Ganti dengan API Key Anda
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxoQU_2eU8bqduOybvWRv9DyTf8T7WgHE-gXTzQqrNcB_urV3xG72Hlc-W6vT7wJT9JWQ/exec'; // Ganti dengan URL Web App dari Google Apps Script
// Data untuk dropdown
const jabatanOptions = [
    'Kepala BPS Kabupaten/Kota',
    'Kepala Bagian Umum',
    'Kepala Subbagian Umum',
    'Penata Laksana Barang Mahir',
    'Penata Laksana Barang Terampil',
    'Analis Pengelola Keuangan APBN Ahli Madya',
    'Analis Pengelola Keuangan APBN Ahli Muda',
    'Analis Pengelola Keuangan APBN Ahli Pertama',
    'Pranata Keuangan APBN Penyelia',
    'Pranata Keuangan APBN Mahir',
    'Pranata Keuangan APBN Terampil',
    'Analis Anggaran Ahli Madya',
    'Analis Anggaran Ahli Muda',
    'Analis Anggaran Ahli Pertama',
    'Analis SDM Aparatur Ahli Muda',
    'Analis SDM Aparatur Ahli Pertama',
    'Pranata SDM Aparatur Penyelia',
    'Pranata SDM Aparatur Mahir',
    'Pranata SDM Aparatur Terampil',
    'Arsiparis Ahli Madya',
    'Arsiparis Ahli Muda',
    'Arsiparis Ahli Pertama',
    'Arsiparis Terampil',
    'Penyuluh Hukum Ahli Muda',
    'Penyuluh Hukum Ahli Pertama',
    'Pranata Humas Ahli Muda',
    'Pranata Humas Ahli Pertama',
    'Pustakawan Penyelia',
    'Pustakawan Mahir',
    'Pustakawan Terampil',
    'Pengolah Data',
    'Verifikator Keuangan',
    'Pengelola Surat',
    'Pranata Kearsipan',
    'Pengelola Barang Milik Negara',
    'Teknisi Pemeliharaan Sarana dan Prasarana',
    'Pengemudi',
    'Statistisi Ahli Utama',
    'Statistisi Ahli Madya',
    'Statistisi Ahli Muda',
    'Statistisi Ahli Pertama',
    'Statistisi Penyelia',
    'Statistisi Mahir',
    'Statistisi Terampil',
    'Pranata Komputer Ahli Utama',
    'Pranata Komputer Ahli Madya',
    'Pranata Komputer Ahli Muda',
    'Pranata Komputer Ahli Pertama',
    'Pranata Komputer Penyelia',
    'Pranata Komputer Mahir',
    'Pranata Komputer Terampil',
    'Pengolah Data',
    'Sekretaris'
];

const pangkatOptions = [
    'Juru Muda/Ia',
    'Juru Muda Tingkat/Ib',
    'Juru/Ic',
    'Juru Tingkat I/Id',
    'Pengatur Muda/IIa',
    'Pengatur Muda Tingkat I/IIb',
    'Pengatur/IIc',
    'Pengatur Tingkat I/IId',
    'Penata Muda/IIIa',
    'Penata Muda Tingkat I/IIIb',
    'Penata/IIIc',
    'Penata Tingkat I/IIId',
    'Pembina/IVa',
    'Pembina Tingkat I/IVb',
    'Pembina Muda/IVc',
    'Pembina Madya/IVd',
    'Pembina Utama/IVe'
];

// Global variables
let currentParticipantData = null;
let qrCodeDataUrl = '';
let qrCodeInstance = null;
let isNewRegistration = false;
let allParticipants = [];
let participantMap = new Map(); // Untuk pencarian yang lebih cepat

// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Inisialisasi form pendaftaran jika ada
    if (document.getElementById('registration-form')) {
        initializeRegistrationForm();
    }
});

// Inisialisasi Form Pendaftaran
function initializeRegistrationForm() {
    console.log('Menginisialisasi form pendaftaran...');
    
    // Isi dropdown grade
    const gradeSelect = document.getElementById('grade');
    gradeSelect.innerHTML = '<option value="">Pilih Grade</option>';
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        gradeSelect.appendChild(option);
    }
    
    // Isi dropdown jabatan
    const jabatanSelect = document.getElementById('jabatan');
    jabatanSelect.innerHTML = '<option value="">Pilih Jabatan</option>';
    jabatanOptions.forEach(jabatan => {
        const option = document.createElement('option');
        option.value = jabatan;
        option.textContent = jabatan;
        jabatanSelect.appendChild(option);
    });
    
    // Isi dropdown pangkat
    const pangkatSelect = document.getElementById('pangkat');
    pangkatSelect.innerHTML = '<option value="">Pilih Pangkat/Golongan</option>';
    pangkatOptions.forEach(pangkat => {
        const option = document.createElement('option');
        option.value = pangkat;
        option.textContent = pangkat;
        pangkatSelect.appendChild(option);
    });
    
    // Set default values
    document.getElementById('konfirmasi_kehadiran').value = 'Hadir';
    document.getElementById('jumlah_tamu').value = '0';
    
    // Load data dari Google Sheets
    loadAllData();
    
    // Setup pencarian nama
    setupNameSearch();
    
    // Setup form submission
    document.getElementById('registration-form').addEventListener('submit', handleFormSubmit);
    
    // Setup tombol pendaftaran baru
    document.getElementById('new-registration').addEventListener('click', resetForm);
    
    // Setup manual entry
    setupManualEntry();
    
    console.log('Form pendaftaran siap digunakan');
}

// Setup manual entry
function setupManualEntry() {
    const manualEntryBtn = document.getElementById('manual-entry-btn');
    const namaField = document.getElementById('nama');
    
    manualEntryBtn.addEventListener('click', function() {
        isNewRegistration = true;
        enableFormFields();
        namaField.focus();
        showStatusMessage('Silakan isi data Anda secara manual. Pastikan semua field terisi dengan benar.', 'info');
    });
    
    // Juga aktifkan manual entry ketika mengetik langsung di field nama
    namaField.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            isNewRegistration = true;
            enableFormFields();
        }
    });
}

// Enable semua field form untuk diisi manual
function enableFormFields() {
    const fields = [
        'nama', 'satker', 'status', 'agama', 'grade', 
        'jenis_kelamin', 'jabatan', 'pangkat', 'whatsapp', 
        'konfirmasi_kehadiran', 'jumlah_tamu', 'data_tamu'
    ];
    
    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.readOnly = false;
            element.disabled = false;
        }
    });
}

// Load semua data dari Google Sheets
async function loadAllData() {
    try {
        console.log('Memuat data dari Google Sheets...');
        showStatusMessage('Memuat data...', 'info');
        
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Data diterima dari Google Sheets:', data);
        
        if (data.values && data.values.length > 1) {
            allParticipants = data.values.slice(1); // Exclude header row
            
            // Build participant map untuk pencarian yang lebih cepat
            allParticipants.forEach(participant => {
                const nama = participant[0] ? participant[0].toString().trim() : '';
                if (nama) {
                    participantMap.set(nama.toLowerCase(), participant);
                }
            });
            
            console.log('Total peserta ditemukan:', allParticipants.length);
            console.log('Participant map size:', participantMap.size);
            
            // Load Satker data
            loadSatkerData(data.values);
            
            hideStatusMessage();
        } else {
            throw new Error('Data tidak ditemukan atau format tidak sesuai');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showStatusMessage('Gagal memuat data. Silakan refresh halaman.', 'error');
        
        // Fallback: tetap enable form untuk manual entry
        enableFormFields();
    }
}

// Load data Satker
function loadSatkerData(data) {
    const satkerSet = new Set();
    
    // Ambil semua nilai dari kolom Satker Asal (indeks 1)
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row && row.length > 1 && row[1]) {
            const satkerValue = row[1].toString().trim();
            if (satkerValue !== '') {
                satkerSet.add(satkerValue);
            }
        }
    }
    
    // Urutkan dan isi dropdown
    const satkerArray = Array.from(satkerSet).sort();
    const satkerSelect = document.getElementById('satker');
    
    satkerSelect.innerHTML = '<option value="">Pilih Satker Asal</option>';
    satkerArray.forEach(satker => {
        const option = document.createElement('option');
        option.value = satker;
        option.textContent = satker;
        satkerSelect.appendChild(option);
    });
    
    console.log(`Data Satker berhasil dimuat: ${satkerArray.length} item`);
}

// Setup pencarian nama - VERSI OPTIMIZED
function setupNameSearch() {
    const searchInput = document.getElementById('nama-search');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', debounce(function() {
        const searchTerm = this.value.trim();
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        console.log(`Mencari: "${searchTerm}"`);
        
        // Cari di participant map untuk performa lebih baik
        const matches = [];
        const searchTermLower = searchTerm.toLowerCase();
        
        for (let [nama, participant] of participantMap) {
            if (nama.includes(searchTermLower)) {
                matches.push({
                    nama: participant[0] || '',
                    participant: participant
                });
                
                // Batasi hasil maksimal untuk performa
                if (matches.length >= 20) break;
            }
        }
        
        console.log('Hasil pencarian:', matches.length);
        displaySearchResults(matches);
    }, 300));
    
    // Sembunyikan hasil pencarian ketika klik di luar
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });
}

// Debounce function untuk optimasi pencarian
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Tampilkan hasil pencarian
function displaySearchResults(matches) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (matches.length === 0) {
        const noResult = document.createElement('div');
        noResult.className = 'search-result-item';
        noResult.textContent = 'Data tidak ditemukan. Klik untuk mengisi manual.';
        noResult.style.color = '#666';
        noResult.style.fontStyle = 'italic';
        
        noResult.addEventListener('click', function() {
            isNewRegistration = true;
            enableFormFields();
            document.getElementById('nama').value = document.getElementById('nama-search').value;
            document.getElementById('nama').focus();
            searchResults.style.display = 'none';
            showStatusMessage('Silakan lengkapi data Anda secara manual.', 'info');
        });
        
        searchResults.appendChild(noResult);
    } else {
        matches.forEach(match => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.textContent = match.nama;
            
            resultItem.addEventListener('click', function() {
                fillFormWithData(match.participant);
                searchResults.style.display = 'none';
                document.getElementById('nama-search').value = match.nama;
            });
            
            searchResults.appendChild(resultItem);
        });
    }
    
    searchResults.style.display = 'block';
}

// Isi form dengan data yang dipilih
function fillFormWithData(participant) {
    currentParticipantData = participant;
    isNewRegistration = false;
    
    // Map kolom berdasarkan struktur data Anda
    const fieldMap = {
        'nama': 0,        // Nama
        'satker': 1,      // Satker Asal
        'status': 2,      // Status
        'agama': 3,       // Agama
        'grade': 4,       // Grade
        'jenis_kelamin': 5, // Jenis Kelamin
        'jabatan': 6,     // Jabatan
        'pangkat': 7,     // Pangkat/Golongan
        'whatsapp': 8,    // WhatsApp
        'konfirmasi_kehadiran': 9, // Konfirmasi Kehadiran
        'jumlah_tamu': 10, // Jumlah Tamu
        'data_tamu': 11   // Data Tamu
    };
    
    // Isi semua field dengan handling data yang mungkin kosong
    Object.keys(fieldMap).forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            const colIndex = fieldMap[field];
            let value = '';
            
            if (participant && participant.length > colIndex) {
                value = participant[colIndex] ? participant[colIndex].toString() : '';
            }
            
            element.value = value;
            
            // Enable field untuk editing
            element.readOnly = false;
            element.disabled = false;
        }
    });
    
    // Set default values jika kosong
    if (!document.getElementById('konfirmasi_kehadiran').value) {
        document.getElementById('konfirmasi_kehadiran').value = 'Hadir';
    }
    if (!document.getElementById('jumlah_tamu').value) {
        document.getElementById('jumlah_tamu').value = '0';
    }
    
    console.log('Form berhasil diisi dengan data:', participant[0]);
    showStatusMessage(`Data ${participant[0]} berhasil dimuat. Silakan perbarui informasi yang diperlukan.`, 'success');
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Tampilkan loading state
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validasi data
    if (!validateFormData(data)) {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        return;
    }
    
    // Format nomor WhatsApp
    const whatsapp = data.whatsapp.replace(/\D/g, '');
    if (whatsapp.length < 10) {
        showStatusMessage('Nomor WhatsApp tidak valid', 'error');
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        return;
    }
    data.whatsapp = whatsapp;
    
    try {
        console.log('Mengirim data:', data);
        showStatusMessage('Menyimpan data...', 'info');
        
        // Simpan data (untuk sekarang simpan di localStorage)
        const saveResult = await saveToLocalStorage(data);
        
        if (saveResult.success) {
            showStatusMessage('Data berhasil disimpan! Membuat QR Code...', 'success');
            
            // Generate QR Code dengan data yang dioptimasi
            await generateQRCode(data);
            
            // Tampilkan QR Code container
            document.getElementById('qr-container').style.display = 'block';
            
            // Scroll ke QR Code
            document.getElementById('qr-container').scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            const message = isNewRegistration ? 
                'Pendaftaran berhasil! QR Code telah dibuat.' : 
                'Data berhasil diperbarui! QR Code telah dibuat.';
                
            showStatusMessage(message, 'success');
            
        } else {
            throw new Error(saveResult.message || 'Gagal menyimpan data');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showStatusMessage('Terjadi kesalahan: ' + error.message, 'error');
    } finally {
        // Reset button state
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// Validasi form data
function validateFormData(data) {
    const requiredFields = ['nama', 'satker', 'status', 'agama', 'grade', 'jenis_kelamin', 'jabatan', 'pangkat', 'whatsapp', 'konfirmasi_kehadiran'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showStatusMessage(`Field ${getFieldLabel(field)} harus diisi`, 'error');
            document.getElementById(field).focus();
            return false;
        }
    }
    
    // Validasi nomor WhatsApp
    const whatsappRegex = /^[0-9]{10,15}$/;
    const cleanWhatsapp = data.whatsapp.replace(/\D/g, '');
    if (!whatsappRegex.test(cleanWhatsapp)) {
        showStatusMessage('Nomor WhatsApp tidak valid. Minimal 10 digit angka.', 'error');
        document.getElementById('whatsapp').focus();
        return false;
    }
    
    return true;
}

// Helper function untuk mendapatkan label field
function getFieldLabel(field) {
    const labels = {
        'nama': 'Nama Lengkap',
        'satker': 'Satker Asal',
        'status': 'Status',
        'agama': 'Agama',
        'grade': 'Grade',
        'jenis_kelamin': 'Jenis Kelamin',
        'jabatan': 'Jabatan',
        'pangkat': 'Pangkat/Golongan',
        'whatsapp': 'Nomor WhatsApp',
        'konfirmasi_kehadiran': 'Konfirmasi Kehadiran'
    };
    return labels[field] || field;
}

// Simpan ke localStorage (temporary solution)
async function saveToLocalStorage(data) {
    try {
        console.log('Menyimpan data ke localStorage:', data);
        
        const submissionData = {
            ...data,
            id: generateUniqueId(),
            timestamp: new Date().toISOString(),
            isNewRegistration: isNewRegistration
        };
        
        const submissions = JSON.parse(localStorage.getItem('natalRegistrations') || '[]');
        submissions.push(submissionData);
        localStorage.setItem('natalRegistrations', JSON.stringify(submissions));
        
        return { 
            success: true, 
            message: 'Data berhasil disimpan di localStorage',
            data: submissionData
        };
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return {
            success: false,
            message: 'Gagal menyimpan data: ' + error.message
        };
    }
}

// Generate QR Code dengan data yang dioptimasi
function generateQRCode(data) {
    return new Promise((resolve, reject) => {
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        
        // Data yang dioptimasi untuk QR Code - HANYA data essential
        const qrData = {
            i: generateUniqueId(), // ID unik (disingkat)
            n: data.nama,          // Nama (disingkat)
            w: data.whatsapp,      // WhatsApp (disingkat)
            t: Date.now(),         // Timestamp
            j: data.jumlah_tamu    // Jumlah tamu (disingkat)
        };
        
        // Konversi ke string JSON yang ringkas
        const qrDataString = JSON.stringify(qrData);
        console.log('QR Code data length:', qrDataString.length);
        console.log('QR Code data:', qrDataString);
        
        try {
            // Generate QR Code dengan error correction yang lebih rendah untuk mengurangi size
            qrCodeInstance = new QRCode(qrContainer, {
                text: qrDataString,
                width: 180,  // Sedikit lebih kecil
                height: 180,
                colorDark: "#1a472a",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.M // Medium error correction
            });
            
            // Update QR info
            document.getElementById('qr-date').textContent = new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            document.getElementById('qr-nama').textContent = data.nama;
            document.getElementById('qr-status').textContent = isNewRegistration ? 'Pendaftaran Baru' : 'Update Data';
            
            // Setup tombol download dan share
            setTimeout(() => {
                const canvas = qrContainer.querySelector('canvas');
                if (canvas) {
                    qrCodeDataUrl = canvas.toDataURL('image/png');
                    setupQRCodeButtons(data);
                    resolve();
                } else {
                    reject(new Error('Canvas tidak ditemukan'));
                }
            }, 150);
            
        } catch (error) {
            console.error('Error generating QR Code:', error);
            
            // Fallback: buat QR code dengan data yang lebih sederhana
            try {
                qrContainer.innerHTML = '';
                const fallbackData = `${data.nama}|${generateUniqueId()}`;
                
                qrCodeInstance = new QRCode(qrContainer, {
                    text: fallbackData,
                    width: 160,
                    height: 160,
                    colorDark: "#1a472a",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.L // Low error correction
                });
                
                setTimeout(() => {
                    const canvas = qrContainer.querySelector('canvas');
                    if (canvas) {
                        qrCodeDataUrl = canvas.toDataURL('image/png');
                        setupQRCodeButtons(data);
                        resolve();
                    } else {
                        reject(new Error('Fallback canvas tidak ditemukan'));
                    }
                }, 150);
                
            } catch (fallbackError) {
                reject(new Error('Gagal membuat QR Code: ' + fallbackError.message));
            }
        }
    });
}

// Generate unique ID untuk QR Code
function generateUniqueId() {
    return 'N' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
}

// Setup tombol download dan share QR Code
function setupQRCodeButtons(data) {
    const downloadBtn = document.getElementById('download-qr');
    const whatsappBtn = document.getElementById('share-whatsapp');
    
    // Tombol Download QR Code
    if (downloadBtn) {
        downloadBtn.onclick = function() {
            try {
                const link = document.createElement('a');
                link.download = `QR-Code-${data.nama.replace(/\s+/g, '-')}.png`;
                link.href = qrCodeDataUrl;
                link.click();
                console.log('QR Code berhasil didownload');
            } catch (error) {
                console.error('Error downloading QR Code:', error);
                showStatusMessage('Gagal mendownload QR Code', 'error');
            }
        };
    }
    
    // Tombol Share via WhatsApp
    if (whatsappBtn) {
        whatsappBtn.onclick = function() {
            try {
                const message = `Halo ${data.nama},\n\n*QR CODE ACARA NATAL*\n\nBerikut adalah QR Code untuk acara Natal:\n\n📅 Tanggal: 25 Desember 2023\n⏰ Waktu: 18:00 - 22:00 WIB\n📍 Tempat: Aula Utama Gedung Serbaguna\n\n*Informasi:*\n- Nama: ${data.nama}\n- Satker: ${data.satker}\n- Jumlah Tamu: ${data.jumlah_tamu}\n\n*Silakan tunjukkan QR Code ini saat check-in.*\n\nTerima kasih! 🎄`;
                
                const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                console.log('Membuka WhatsApp untuk:', data.whatsapp);
            } catch (error) {
                console.error('Error sharing to WhatsApp:', error);
                showStatusMessage('Gagal membuka WhatsApp', 'error');
            }
        };
    }
}

// Reset form untuk pendaftaran baru
function resetForm() {
    document.getElementById('registration-form').reset();
    document.getElementById('qr-container').style.display = 'none';
    document.getElementById('nama-search').value = '';
    currentParticipantData = null;
    qrCodeDataUrl = '';
    isNewRegistration = false;
    
    // Reset form fields
    const resetFields = ['nama', 'satker', 'status', 'agama', 'grade', 'jenis_kelamin', 'jabatan', 'pangkat', 'whatsapp', 'konfirmasi_kehadiran', 'jumlah_tamu', 'data_tamu'];
    resetFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.value = '';
            element.readOnly = false;
            element.disabled = false;
        }
    });
    
    // Set default values
    document.getElementById('konfirmasi_kehadiran').value = 'Hadir';
    document.getElementById('jumlah_tamu').value = '0';
    
    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showStatusMessage('Form telah direset. Silakan cari nama Anda atau isi data manual.', 'info');
}

// Show status message
function showStatusMessage(message, type = 'info') {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        statusElement.style.display = 'block';
        
        // Auto hide success/info messages after 5 seconds
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    }
}

// Hide status message
function hideStatusMessage() {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.style.display = 'none';
    }
}

// Error handling global
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showStatusMessage('Terjadi kesalahan sistem. Silakan refresh halaman.', 'error');
});

// Offline handling
window.addEventListener('online', function() {
    showStatusMessage('Koneksi internet pulih.', 'success');
    setTimeout(hideStatusMessage, 3000);
});

window.addEventListener('offline', function() {
    showStatusMessage('Anda sedang offline. Beberapa fitur mungkin tidak berfungsi.', 'warning');
});
