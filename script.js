// Google Sheets Configuration
const SHEET_ID = '10G7c_jfQ9_wr8wjs3BnOgcCn4DDeomJFrKEgkCT3ZZ8';
const API_KEY = 'AIzaSyAB28UliPqPfO27zWdcKsI39DMWVcwryiY'; // Ganti dengan API Key Anda

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
    // Isi dropdown grade
    const gradeSelect = document.getElementById('grade');
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        gradeSelect.appendChild(option);
    }
    
    // Isi dropdown jabatan
    const jabatanSelect = document.getElementById('jabatan');
    jabatanOptions.forEach(jabatan => {
        const option = document.createElement('option');
        option.value = jabatan;
        option.textContent = jabatan;
        jabatanSelect.appendChild(option);
    });
    
    // Isi dropdown pangkat
    const pangkatSelect = document.getElementById('pangkat');
    pangkatOptions.forEach(pangkat => {
        const option = document.createElement('option');
        option.value = pangkat;
        option.textContent = pangkat;
        pangkatSelect.appendChild(option);
    });
    
    // Load data Satker dari Google Sheets
    loadSatkerData();
    
    // Setup pencarian nama
    setupNameSearch();
    
    // Setup form submission
    document.getElementById('registration-form').addEventListener('submit', handleFormSubmit);
}

// Load data Satker dari Google Sheets
async function loadSatkerData() {
    try {
        // Menggunakan Google Sheets API v4
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            const satkerSet = new Set();
            
            // Ambil semua nilai dari kolom Satker Asal (indeks 1)
            for (let i = 1; i < data.values.length; i++) {
                if (data.values[i][1]) {
                    satkerSet.add(data.values[i][1]);
                }
            }
            
            // Urutkan dan isi dropdown
            const satkerArray = Array.from(satkerSet).sort();
            const satkerSelect = document.getElementById('satker');
            
            satkerArray.forEach(satker => {
                const option = document.createElement('option');
                option.value = satker;
                option.textContent = satker;
                satkerSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading Satker data:', error);
    }
}

// Setup pencarian nama
function setupNameSearch() {
    const searchInput = document.getElementById('nama-search');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', async function() {
        const searchTerm = this.value.trim();
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        try {
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const matches = [];
                const headers = data.values[0];
                
                for (let i = 1; i < data.values.length; i++) {
                    const row = data.values[i];
                    const nama = row[0]; // Kolom Nama
                    
                    if (nama && nama.toLowerCase().includes(searchTerm.toLowerCase())) {
                        matches.push({
                            nama: nama,
                            rowIndex: i,
                            data: row
                        });
                    }
                }
                
                displaySearchResults(matches, headers);
            }
        } catch (error) {
            console.error('Error searching names:', error);
        }
    });
    
    // Sembunyikan hasil pencarian ketika klik di luar
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });
}

// Tampilkan hasil pencarian
function displaySearchResults(matches, headers) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    
    if (matches.length === 0) {
        searchResults.style.display = 'none';
        return;
    }
    
    matches.forEach(match => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.textContent = match.nama;
        
        resultItem.addEventListener('click', function() {
            fillFormWithData(match, headers);
            searchResults.style.display = 'none';
            document.getElementById('nama-search').value = match.nama;
        });
        
        searchResults.appendChild(resultItem);
    });
    
    searchResults.style.display = 'block';
}

// Isi form dengan data yang dipilih
function fillFormWithData(match, headers) {
    const row = match.data;
    
    document.getElementById('nama').value = row[headers.indexOf('Nama')] || '';
    document.getElementById('satker').value = row[headers.indexOf('Satker Asal')] || '';
    document.getElementById('status').value = row[headers.indexOf('Status')] || '';
    document.getElementById('agama').value = row[headers.indexOf('Agama')] || '';
    document.getElementById('grade').value = row[headers.indexOf('Grade')] || '';
    document.getElementById('jenis_kelamin').value = row[headers.indexOf('Jenis Kelamin')] || '';
    document.getElementById('jabatan').value = row[headers.indexOf('Jabatan')] || '';
    document.getElementById('pangkat').value = row[headers.indexOf('Pangkat/Golongan')] || '';
    document.getElementById('whatsapp').value = row[headers.indexOf('WhatsApp')] || '';
    document.getElementById('konfirmasi_kehadiran').value = row[headers.indexOf('Konfirmasi Kehadiran')] || '';
    document.getElementById('jumlah_tamu').value = row[headers.indexOf('Jumlah Tamu')] || '';
    document.getElementById('data_tamu').value = row[headers.indexOf('Data Tamu')] || '';
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    try {
        // Kirim data ke Google Sheets (menggunakan Google Apps Script sebagai proxy)
        await updateGoogleSheets(data);
        
        // Generate QR Code
        generateQRCode(data);
        
        // Tampilkan QR Code container
        document.getElementById('qr-container').style.display = 'block';
        
        // Scroll ke QR Code
        document.getElementById('qr-container').scrollIntoView({ behavior: 'smooth' });
        
        alert('Pendaftaran berhasil! QR Code telah dibuat.');
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    }
}

// Update Google Sheets dengan data baru
async function updateGoogleSheets(data) {
    // Di sini Anda perlu membuat Google Apps Script untuk menangani update data
    // karena Google Sheets API tidak mengizinkan update langsung dari frontend
    // tanpa mengungkapkan kredensial
    
    // Contoh implementasi dengan Google Apps Script:
    // const scriptURL = 'YOUR_GOOGLE_APPS_SCRIPT_URL';
    // const response = await fetch(scriptURL, {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });
    // 
    // return await response.json();
    
    // Untuk sementara, kita simpan di localStorage
    const submissions = JSON.parse(localStorage.getItem('natalRegistrations') || '[]');
    submissions.push({
        ...data,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('natalRegistrations', JSON.stringify(submissions));
    
    return { success: true };
}

// Generate QR Code
function generateQRCode(data) {
    const qrContainer = document.getElementById('qrcode');
    qrContainer.innerHTML = '';
    
    // Buat data untuk QR Code
    const qrData = JSON.stringify({
        nama: data.nama,
        whatsapp: data.whatsapp,
        timestamp: new Date().toISOString()
    });
    
    // Generate QR Code
    new QRCode(qrContainer, {
        text: qrData,
        width: 200,
        height: 200,
        colorDark: "#1a472a",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}
