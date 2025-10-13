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
    currentParticipantData = {
        rowIndex: match.rowIndex,
        originalData: row
    };
    
    document.getElementById('nama').value = row[headers.indexOf('Nama')] || '';
    document.getElementById('satker').value = row[headers.indexOf('Satker Asal')] || '';
    document.getElementById('status').value = row[headers.indexOf('Status')] || '';
    document.getElementById('agama').value = row[headers.indexOf('Agama')] || '';
    document.getElementById('grade').value = row[headers.indexOf('Grade')] || '';
    document.getElementById('jenis_kelamin').value = row[headers.indexOf('Jenis Kelamin')] || '';
    document.getElementById('jabatan').value = row[headers.indexOf('Jabatan')] || '';
    document.getElementById('pangkat').value = row[headers.indexOf('Pangkat/Golongan')] || '';
    document.getElementById('whatsapp').value = row[headers.indexOf('WhatsApp')] || '';
    document.getElementById('konfirmasi_kehadiran').value = row[headers.indexOf('Konfirmasi Kehadiran')] || 'Hadir';
    document.getElementById('jumlah_tamu').value = row[headers.indexOf('Jumlah Tamu')] || '0';
    document.getElementById('data_tamu').value = row[headers.indexOf('Data Tamu')] || '';
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    // Validasi nomor WhatsApp
    const whatsapp = data.whatsapp.replace(/\D/g, '');
    if (whatsapp.length < 10) {
        alert('Nomor WhatsApp tidak valid');
        return;
    }
    data.whatsapp = whatsapp;
    
    try {
        // Update data ke Google Sheets via Web App
        const updateResult = await updateGoogleSheets(data);
        
        if (updateResult.success) {
            // Generate QR Code
            await generateQRCode(data);
            
            // Tampilkan QR Code container
            document.getElementById('qr-container').style.display = 'block';
            
            // Scroll ke QR Code
            document.getElementById('qr-container').scrollIntoView({ behavior: 'smooth' });
            
            alert('Pendaftaran berhasil! Data telah disimpan dan QR Code telah dibuat.');
        } else {
            throw new Error(updateResult.message || 'Gagal mengupdate data');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Terjadi kesalahan saat mendaftar: ' + error.message);
    }
}

// Update Google Sheets via Web App
async function updateGoogleSheets(data) {
    if (!WEB_APP_URL || WEB_APP_URL === 'YOUR_WEB_APP_URL') {
        throw new Error('Web App URL belum dikonfigurasi. Silakan setup Google Apps Script terlebih dahulu.');
    }
    
    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating Google Sheets:', error);
        throw new Error('Gagal terhubung ke server. Silakan coba lagi.');
    }
}

// Generate QR Code dengan data yang lebih lengkap
function generateQRCode(data) {
    return new Promise((resolve) => {
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        
        // Buat data untuk QR Code (lebih lengkap untuk keperluan check-in)
        const qrData = JSON.stringify({
            nama: data.nama,
            satker: data.satker,
            whatsapp: data.whatsapp,
            jumlah_tamu: data.jumlah_tamu,
            timestamp: new Date().toISOString(),
            id: Math.random().toString(36).substr(2, 9) // ID unik untuk QR Code
        });
        
        // Generate QR Code
        const qrcode = new QRCode(qrContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#1a472a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        
        // Tunggu sampai QR Code selesai digenerate, lalu ambil data URL
        setTimeout(() => {
            const canvas = qrContainer.querySelector('canvas');
            if (canvas) {
                qrCodeDataUrl = canvas.toDataURL('image/png');
                
                // Setup tombol download dan share
                setupQRCodeButtons(data);
            }
            resolve();
        }, 100);
    });
}

// Setup tombol download dan share QR Code
function setupQRCodeButtons(data) {
    const downloadBtn = document.getElementById('download-qr');
    const whatsappBtn = document.getElementById('share-whatsapp');
    
    // Tombol Download QR Code
    if (downloadBtn) {
        downloadBtn.onclick = function() {
            const link = document.createElement('a');
            link.download = `QR-Code-${data.nama.replace(/\s+/g, '-')}.png`;
            link.href = qrCodeDataUrl;
            link.click();
        };
    }
    
    // Tombol Share via WhatsApp
    if (whatsappBtn) {
        whatsappBtn.onclick = function() {
            const message = `Halo ${data.nama},\n\nBerikut adalah QR Code untuk acara Natal. Silakan simpan dan tunjukkan saat check-in.\n\nTerima kasih!`;
            const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        };
    }
}
