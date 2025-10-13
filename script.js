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
    
    // Setup tombol pendaftaran baru
    document.getElementById('new-registration').addEventListener('click', resetForm);
    
    // Setup manual entry
    setupManualEntry();
    
    console.log('Form pendaftaran siap digunakan');
}

// Setup manual entry untuk nama yang belum terdaftar
function setupManualEntry() {
    const namaField = document.getElementById('nama');
    
    // Ketika user mengetik di field nama secara manual
    namaField.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            isNewRegistration = true;
            // Enable semua field untuk diisi manual
            enableFormFields();
        }
    });
    
    // Tombol untuk mode manual entry
    const manualEntryBtn = document.createElement('button');
    manualEntryBtn.type = 'button';
    manualEntryBtn.className = 'btn-manual';
    manualEntryBtn.innerHTML = '📝 Isi Data Manual (Nama belum terdaftar)';
    manualEntryBtn.style.marginTop = '10px';
    manualEntryBtn.style.width = '100%';
    manualEntryBtn.style.padding = '10px';
    manualEntryBtn.style.backgroundColor = '#ffc107';
    manualEntryBtn.style.color = '#000';
    manualEntryBtn.style.border = 'none';
    manualEntryBtn.style.borderRadius = '5px';
    manualEntryBtn.style.cursor = 'pointer';
    
    manualEntryBtn.addEventListener('click', function() {
        isNewRegistration = true;
        enableFormFields();
        document.getElementById('nama').focus();
        showStatusMessage('Silakan isi data Anda secara manual. Pastikan semua field terisi dengan benar.', 'info');
    });
    
    // Tambahkan tombol manual entry setelah search section
    const searchSection = document.querySelector('.search-section');
    searchSection.appendChild(manualEntryBtn);
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
    
    // Set default values untuk field yang kosong
    if (!document.getElementById('konfirmasi_kehadiran').value) {
        document.getElementById('konfirmasi_kehadiran').value = 'Hadir';
    }
    if (!document.getElementById('jumlah_tamu').value) {
        document.getElementById('jumlah_tamu').value = '0';
    }
}

// Load data Satker dari Google Sheets
async function loadSatkerData() {
    try {
        console.log('Memuat data Satker...');
        showStatusMessage('Memuat data Satker...', 'info');
        
        // Menggunakan Google Sheets API v4
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.values && data.values.length > 1) {
            const satkerSet = new Set();
            
            // PERBAIKAN: Handle data yang tidak lengkap dengan lebih baik
            for (let i = 1; i < data.values.length; i++) {
                const row = data.values[i];
                // Pastikan row ada dan memiliki setidaknya 2 kolom
                if (row && row.length > 1) {
                    // Gunakan toString() dan cek jika undefined/null
                    const satkerValue = row[1] ? row[1].toString().trim() : '';
                    if (satkerValue !== '') {
                        satkerSet.add(satkerValue);
                    }
                }
            }
            
            // Urutkan dan isi dropdown
            const satkerArray = Array.from(satkerSet).sort();
            const satkerSelect = document.getElementById('satker');
            
            // Hapus opsi loading jika ada
            satkerSelect.innerHTML = '<option value="">Pilih Satker Asal</option>';
            
            satkerArray.forEach(satker => {
                const option = document.createElement('option');
                option.value = satker;
                option.textContent = satker;
                satkerSelect.appendChild(option);
            });
            
            console.log(`Data Satker berhasil dimuat: ${satkerArray.length} item`);
            hideStatusMessage();
        } else {
            throw new Error('Data tidak ditemukan atau format tidak sesuai');
        }
    } catch (error) {
        console.error('Error loading Satker data:', error);
        showStatusMessage('Gagal memuat data Satker. Silakan refresh halaman.', 'error');
    }
}

// Setup pencarian nama - VERSI DIPERBAIKI
function setupNameSearch() {
    const searchInput = document.getElementById('nama-search');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', debounce(async function() {
        const searchTerm = this.value.trim();
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        try {
            console.log(`Mencari nama: ${searchTerm}`);
            showStatusMessage('Mencari data...', 'info');
            
            const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.values && data.values.length > 1) {
                const matches = [];
                const headers = data.values[0];
                
                // PERBAIKAN: Handle data yang tidak lengkap dengan lebih baik
                for (let i = 1; i < data.values.length; i++) {
                    const row = data.values[i];
                    // Pastikan row ada dan memiliki kolom nama
                    if (row && row.length > 0) {
                        // Gunakan toString() dan cek jika undefined/null
                        const nama = row[0] ? row[0].toString().trim() : '';
                        if (nama && nama.toLowerCase().includes(searchTerm.toLowerCase())) {
                            matches.push({
                                nama: nama,
                                rowIndex: i,
                                data: row
                            });
                        }
                    }
                }
                
                displaySearchResults(matches, headers);
                hideStatusMessage();
            }
        } catch (error) {
            console.error('Error searching names:', error);
            showStatusMessage('Gagal mencari data. Silakan coba lagi.', 'error');
        }
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
function displaySearchResults(matches, headers) {
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
                fillFormWithData(match, headers);
                searchResults.style.display = 'none';
                document.getElementById('nama-search').value = match.nama;
            });
            
            searchResults.appendChild(resultItem);
        });
    }
    
    searchResults.style.display = 'block';
}

// Isi form dengan data yang dipilih - VERSI DIPERBAIKI
function fillFormWithData(match, headers) {
    const row = match.data;
    currentParticipantData = {
        rowIndex: match.rowIndex,
        originalData: row
    };
    
    isNewRegistration = false;
    
    // Map data ke form fields dengan handling data yang tidak lengkap
    const fieldMap = {
        'nama': 0,
        'satker': 1,
        'status': 2,
        'agama': 3,
        'grade': 4,
        'jenis_kelamin': 5,
        'jabatan': 6,
        'pangkat': 7,
        'whatsapp': 8,
        'konfirmasi_kehadiran': 9,
        'jumlah_tamu': 10,
        'data_tamu': 11
    };
    
    Object.keys(fieldMap).forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            const colIndex = fieldMap[field];
            // PERBAIKAN: Pastikan row memiliki data di kolom tersebut
            let value = '';
            if (row && row.length > colIndex && row[colIndex] !== undefined && row[colIndex] !== null) {
                value = row[colIndex].toString();
            }
            element.value = value;
            
            // Trigger change event untuk update UI
            const event = new Event('change', { bubbles: true });
            element.dispatchEvent(event);
        }
    });
    
    // Set default konfirmasi kehadiran jika kosong
    if (!document.getElementById('konfirmasi_kehadiran').value) {
        document.getElementById('konfirmasi_kehadiran').value = 'Hadir';
    }
    
    // Set jumlah tamu default jika kosong
    if (!document.getElementById('jumlah_tamu').value) {
        document.getElementById('jumlah_tamu').value = '0';
    }
    
    console.log('Form berhasil diisi dengan data:', match.nama);
    showStatusMessage(`Data ${match.nama} berhasil dimuat. Silakan perbarui informasi yang diperlukan.`, 'success');
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
        console.log('Mengirim data ke server:', data);
        showStatusMessage('Menyimpan data...', 'info');
        
        // Tentukan apakah ini update atau pendaftaran baru
        const isUpdate = !isNewRegistration && currentParticipantData;
        
        // Update data ke Google Sheets via Web App
        const updateResult = await updateGoogleSheets(data, isUpdate);
        
        if (updateResult.success) {
            showStatusMessage('Data berhasil disimpan! Membuat QR Code...', 'success');
            
            // Generate QR Code
            await generateQRCode(data);
            
            // Tampilkan QR Code container
            document.getElementById('qr-container').style.display = 'block';
            
            // Scroll ke QR Code
            document.getElementById('qr-container').scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            const message = isUpdate ? 
                'Data berhasil diperbarui! QR Code telah dibuat.' : 
                'Pendaftaran berhasil! QR Code telah dibuat.';
                
            showStatusMessage(message, 'success');
            
        } else {
            throw new Error(updateResult.message || 'Gagal mengupdate data');
        }
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showStatusMessage('Terjadi kesalahan saat mendaftar: ' + error.message, 'error');
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

// Update Google Sheets via Web App - VERSI DIPERBAIKI untuk CORS
async function updateGoogleSheets(data, isUpdate = false) {
    if (!WEB_APP_URL || WEB_APP_URL === 'YOUR_WEB_APP_URL') {
        // Fallback: Simpan di localStorage untuk testing
        console.warn('Web App URL belum dikonfigurasi. Menyimpan di localStorage...');
        const submissions = JSON.parse(localStorage.getItem('natalRegistrations') || '[]');
        submissions.push({
            ...data,
            timestamp: new Date().toISOString(),
            qrGenerated: true,
            isUpdate: isUpdate
        });
        localStorage.setItem('natalRegistrations', JSON.stringify(submissions));
        return { success: true, message: 'Data disimpan di localStorage (testing mode)' };
    }
    
    try {
        // Tambahkan flag apakah ini update atau pendaftaran baru
        const payload = {
            ...data,
            isNewRegistration: !isUpdate,
            originalNama: isUpdate ? currentParticipantData?.originalData[0] : null
        };
        
        // PERBAIKAN CORS: Gunakan mode 'cors' dan handle error dengan baik
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'cors', // Explicitly set CORS mode
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error updating Google Sheets:', error);
        
        // Fallback ke localStorage jika gagal
        console.warn('Menggunakan fallback ke localStorage...');
        const submissions = JSON.parse(localStorage.getItem('natalRegistrations') || '[]');
        submissions.push({
            ...data,
            timestamp: new Date().toISOString(),
            qrGenerated: true,
            isUpdate: isUpdate,
            error: error.message
        });
        localStorage.setItem('natalRegistrations', JSON.stringify(submissions));
        
        return { 
            success: true, 
            message: 'Data disimpan secara lokal (koneksi server gagal)' 
        };
    }
}

// Generate QR Code dengan data yang lebih lengkap
function generateQRCode(data) {
    return new Promise((resolve) => {
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        
        // Buat data untuk QR Code (lebih lengkap untuk keperluan check-in)
        const qrData = JSON.stringify({
            id: generateUniqueId(),
            nama: data.nama,
            satker: data.satker,
            whatsapp: data.whatsapp,
            jumlah_tamu: data.jumlah_tamu,
            data_tamu: data.data_tamu,
            timestamp: new Date().toISOString(),
            event: 'Acara Natal 2023',
            isNewRegistration: isNewRegistration
        });
        
        // Generate QR Code
        qrCodeInstance = new QRCode(qrContainer, {
            text: qrData,
            width: 200,
            height: 200,
            colorDark: "#1a472a",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
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
        
        // Update status berdasarkan tipe pendaftaran
        document.getElementById('qr-status').textContent = isNewRegistration ? 'Pendaftaran Baru' : 'Update Data';
        
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

// Generate unique ID untuk QR Code
function generateUniqueId() {
    return 'NATAL_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
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
            
            // Track download
            console.log('QR Code downloaded for:', data.nama);
        };
    }
    
    // Tombol Share via WhatsApp
    if (whatsappBtn) {
        whatsappBtn.onclick = function() {
            shareToWhatsApp(data);
        };
    }
}

// Share QR Code ke WhatsApp
function shareToWhatsApp(data) {
    const message = `Halo ${data.nama},\n\n*QR CODE ACARA NATAL*\n\nBerikut adalah QR Code untuk acara Natal yang akan diselenggarakan:\n\n📅 *Tanggal:* 25 Desember 2023\n⏰ *Waktu:* 18:00 - 22:00 WIB\n📍 *Tempat:* Aula Utama Gedung Serbaguna\n\n*Informasi Pendaftaran:*\n- Nama: ${data.nama}\n- Satker: ${data.satker}\n- Jumlah Tamu: ${data.jumlah_tamu}\n\n*Silakan simpan QR Code ini dan tunjukkan saat check-in di lokasi acara.*\n\n_QR Code ini bersifat pribadi dan hanya dapat digunakan sekali._\n\nTerima kasih! 🎄`;
    
    const whatsappUrl = `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Track share
    console.log('QR Code shared via WhatsApp to:', data.whatsapp);
}

// Reset form untuk pendaftaran baru
function resetForm() {
    document.getElementById('registration-form').reset();
    document.getElementById('qr-container').style.display = 'none';
    document.getElementById('nama-search').value = '';
    currentParticipantData = null;
    qrCodeDataUrl = '';
    isNewRegistration = false;
    
    // Reset form fields ke state awal
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
    
    showStatusMessage('Form telah direset. Silakan cari nama Anda atau isi data manual untuk pendaftaran baru.', 'info');
    
    console.log('Form reset untuk pendaftaran baru');
}

// Show status message
function showStatusMessage(message, type = 'info') {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
    statusElement.style.display = 'block';
    
    // Auto hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusElement.style.display = 'none';
        }, 5000);
    }
}

// Hide status message
function hideStatusMessage() {
    const statusElement = document.getElementById('status-message');
    statusElement.style.display = 'none';
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
