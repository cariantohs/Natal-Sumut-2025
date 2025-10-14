// Google Sheets Configuration
const SHEET_ID = '10G7c_jfQ9_wr8wjs3BnOgcCn4DDeomJFrKEgkCT3ZZ8';
const CLIENT_ID = '549342366211-e40bs9po80ef2cticjp2m4094t08eu5f.apps.googleusercontent.com'; // Ganti dengan Client ID dari Google Cloud Console
const API_KEY = 'AIzaSyAB28UliPqPfO27zWdcKsI39DMWVcwryiY';

// Data untuk dropdown (tetap sama)
const jabatanOptions = [/* ... tetap sama ... */];
const pangkatOptions = [/* ... tetap sama ... */];

// Global variables
let currentParticipantData = null;
let qrCodeDataUrl = '';
let qrCodeInstance = null;
let isNewRegistration = false;
let allParticipants = [];
let gapiInited = false;
let gisInited = false;

// Initialize Google API
function initializeGapi() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            gapi.load('client', async () => {
                try {
                    await gapi.client.init({
                        apiKey: API_KEY,
                        discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
                    });
                    gapiInited = true;
                    console.log('Google API initialized');
                    resolve();
                } catch (error) {
                    console.error('Error initializing Google API:', error);
                    reject(error);
                }
            });
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Initialize Google Identity Services
function initializeGis() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.onload = () => {
            // We'll handle auth separately
            gisInited = true;
            console.log('Google Identity Services initialized');
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Hamburger Menu Toggle (tetap sama)
document.addEventListener('DOMContentLoaded', async function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    try {
        // Initialize Google APIs
        await initializeGapi();
        await initializeGis();
        
        console.log('All Google APIs initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Google APIs:', error);
        showStatusMessage('Gagal menginisialisasi Google APIs. Beberapa fitur mungkin tidak berfungsi.', 'warning');
    }
    
    // Inisialisasi form pendaftaran jika ada
    if (document.getElementById('registration-form')) {
        initializeRegistrationForm();
    }
});

// Inisialisasi Form Pendaftaran (tetap sama)
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

// Setup manual entry (tetap sama)
function setupManualEntry() {
    const manualEntryBtn = document.getElementById('manual-entry-btn');
    const namaField = document.getElementById('nama');
    
    manualEntryBtn.addEventListener('click', function() {
        isNewRegistration = true;
        enableFormFields();
        namaField.focus();
        showStatusMessage('Silakan isi data Anda secara manual. Pastikan semua field terisi dengan benar.', 'info');
    });
    
    namaField.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            isNewRegistration = true;
            enableFormFields();
        }
    });
}

// Enable semua field form untuk diisi manual (tetap sama)
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

// Load semua data dari Google Sheets - VERSI DIPERBAIKI
async function loadAllData() {
    try {
        console.log('Memuat data dari Google Sheets...');
        showStatusMessage('Memuat data...', 'info');
        
        if (!gapiInited) {
            throw new Error('Google API belum terinisialisasi');
        }
        
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: SHEET_ID,
            range: 'Sheet1',
        });
        
        console.log('Data diterima dari Google Sheets:', response);
        
        if (response.result.values && response.result.values.length > 1) {
            const headers = response.result.values[0];
            allParticipants = response.result.values.slice(1);
            
            console.log('Total peserta ditemukan:', allParticipants.length);
            console.log('Headers:', headers);
            console.log('Sample data (first 5):', allParticipants.slice(0, 5));
            
            loadSatkerData(allParticipants);
            hideStatusMessage();
        } else {
            throw new Error('Data tidak ditemukan atau format tidak sesuai');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        showStatusMessage('Gagal memuat data. Silakan refresh halaman.', 'error');
        
        // Fallback menggunakan fetch API
        try {
            console.log('Mencoba fallback dengan fetch API...');
            const fallbackResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`);
            
            if (!fallbackResponse.ok) {
                throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
            }
            
            const data = await fallbackResponse.json();
            
            if (data.values && data.values.length > 1) {
                const headers = data.values[0];
                allParticipants = data.values.slice(1);
                
                console.log('Fallback berhasil. Total peserta:', allParticipants.length);
                loadSatkerData(allParticipants);
                hideStatusMessage();
            }
        } catch (fallbackError) {
            console.error('Fallback juga gagal:', fallbackError);
            enableFormFields();
        }
    }
}

// Load data Satker (tetap sama)
function loadSatkerData(participants) {
    const satkerSet = new Set();
    
    participants.forEach(participant => {
        if (participant && participant.length > 1 && participant[1]) {
            const satkerValue = participant[1].toString().trim();
            if (satkerValue !== '') {
                satkerSet.add(satkerValue);
            }
        }
    });
    
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

// Setup pencarian nama (tetap sama)
function setupNameSearch() {
    const searchInput = document.getElementById('nama-search');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) return;
    
    searchResults.style.position = 'absolute';
    searchResults.style.background = 'white';
    searchResults.style.border = '2px solid #ddd';
    searchResults.style.borderTop = 'none';
    searchResults.style.borderRadius = '0 0 8px 8px';
    searchResults.style.maxHeight = '200px';
    searchResults.style.overflowY = 'auto';
    searchResults.style.zIndex = '1000';
    searchResults.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    searchResults.style.display = 'none';
    searchResults.style.width = '100%';
    searchResults.style.left = '0';
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim();
        
        if (searchTerm.length < 2) {
            searchResults.style.display = 'none';
            searchResults.innerHTML = '';
            return;
        }
        
        console.log(`Mencari: "${searchTerm}"`);
        const matches = searchParticipants(searchTerm);
        console.log('Hasil pencarian:', matches.length, 'hasil');
        
        displaySearchResults(matches, searchTerm);
    });
    
    document.addEventListener('click', function(e) {
        if (!searchResults.contains(e.target) && e.target !== searchInput) {
            searchResults.style.display = 'none';
        }
    });
}

// Fungsi pencarian (tetap sama)
function searchParticipants(searchTerm) {
    const searchTermLower = searchTerm.toLowerCase();
    const matches = [];
    
    allParticipants.forEach((participant, index) => {
        if (participant && participant.length > 0 && participant[0]) {
            const nama = participant[0].toString().trim();
            
            if (nama && nama.toLowerCase().includes(searchTermLower)) {
                matches.push({
                    nama: nama,
                    index: index,
                    participant: participant
                });
            }
            
            if (matches.length >= 50) return matches;
        }
    });
    
    return matches;
}

// Tampilkan hasil pencarian (tetap sama)
function displaySearchResults(matches, searchTerm) {
    const searchResults = document.getElementById('search-results');
    const searchInput = document.getElementById('nama-search');
    
    if (!searchResults) return;
    
    searchResults.innerHTML = '';
    
    if (matches.length === 0) {
        const noResult = document.createElement('div');
        noResult.className = 'search-result-item';
        noResult.style.padding = '15px';
        noResult.style.textAlign = 'center';
        noResult.style.color = '#666';
        noResult.style.fontStyle = 'italic';
        noResult.style.cursor = 'pointer';
        noResult.innerHTML = `
            <div>Data "${searchTerm}" tidak ditemukan</div>
            <button type="button" style="margin-top: 10px; padding: 8px 16px; background: #ffc107; border: none; border-radius: 4px; cursor: pointer;">
                📝 Klik untuk mengisi data manual
            </button>
        `;
        
        const manualBtn = noResult.querySelector('button');
        manualBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            isNewRegistration = true;
            enableFormFields();
            document.getElementById('nama').value = searchTerm;
            document.getElementById('nama').focus();
            searchResults.style.display = 'none';
            searchInput.value = searchTerm;
            showStatusMessage('Silakan lengkapi data Anda secara manual.', 'info');
        });
        
        searchResults.appendChild(noResult);
    } else {
        const countElement = document.createElement('div');
        countElement.style.padding = '8px 12px';
        countElement.style.background = '#f8f9fa';
        countElement.style.borderBottom = '1px solid #ddd';
        countElement.style.fontSize = '0.85em';
        countElement.style.color = '#666';
        countElement.textContent = `Ditemukan ${matches.length} hasil untuk "${searchTerm}"`;
        searchResults.appendChild(countElement);
        
        matches.forEach(match => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.style.padding = '12px 15px';
            resultItem.style.cursor = 'pointer';
            resultItem.style.borderBottom = '1px solid #eee';
            resultItem.style.transition = 'background-color 0.2s ease';
            resultItem.textContent = match.nama;
            
            resultItem.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f8f9fa';
            });
            
            resultItem.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
            
            resultItem.addEventListener('click', function() {
                const participant = match.participant;
                
                if (participant) {
                    fillFormWithData(participant);
                    searchResults.style.display = 'none';
                    searchInput.value = match.nama;
                }
            });
            
            searchResults.appendChild(resultItem);
        });
    }
    
    searchResults.style.display = 'block';
    
    const searchInputRect = searchInput.getBoundingClientRect();
    const searchContainer = searchInput.parentElement;
    const containerRect = searchContainer.getBoundingClientRect();
    
    searchResults.style.position = 'absolute';
    searchResults.style.top = '100%';
    searchResults.style.left = '0';
    searchResults.style.width = '100%';
    searchResults.style.maxHeight = '200px';
}

// Isi form dengan data yang dipilih (tetap sama)
function fillFormWithData(participant) {
    if (!participant) {
        console.error('Data peserta tidak valid');
        return;
    }
    
    currentParticipantData = participant;
    isNewRegistration = false;
    
    console.log('Mengisi form dengan data:', participant);
    
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
            let value = '';
            
            if (participant.length > colIndex && participant[colIndex] !== undefined && participant[colIndex] !== null) {
                value = participant[colIndex].toString().trim();
            }
            
            element.value = value;
            element.readOnly = false;
            element.disabled = false;
        }
    });
    
    if (!document.getElementById('konfirmasi_kehadiran').value) {
        document.getElementById('konfirmasi_kehadiran').value = 'Hadir';
    }
    if (!document.getElementById('jumlah_tamu').value) {
        document.getElementById('jumlah_tamu').value = '0';
    }
    
    console.log('Form berhasil diisi dengan data:', participant[0]);
    showStatusMessage(`Data "${participant[0]}" berhasil dimuat. Silakan perbarui informasi yang diperlukan.`, 'success');
}

// Handle form submission - VERSI BARU DENGAN SHEETS API
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    
    if (!validateFormData(data)) {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
        return;
    }
    
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
        
        const saveResult = await saveToGoogleSheetsDirect(data);
        
        if (saveResult.success) {
            showStatusMessage('Data berhasil disimpan! Membuat QR Code...', 'success');
            await generateQRCode(data);
            
            document.getElementById('qr-container').style.display = 'block';
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
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        submitBtn.disabled = false;
    }
}

// SIMPAN KE GOOGLE SHEETS LANGSUNG - FUNGSI UTAMA BARU
async function saveToGoogleSheetsDirect(data) {
    try {
        console.log('Menyimpan langsung ke Google Sheets...');
        
        const isUpdate = !isNewRegistration && currentParticipantData;
        
        // Siapkan data dalam format baris
        const rowData = [
            data.nama,
            data.satker,
            data.status,
            data.agama,
            data.grade,
            data.jenis_kelamin,
            data.jabatan,
            data.pangkat,
            data.whatsapp,
            data.konfirmasi_kehadiran,
            data.jumlah_tamu,
            data.data_tamu,
            new Date().toISOString() // Timestamp
        ];
        
        if (isUpdate && currentParticipantData) {
            // UPDATE DATA EXISTING
            console.log('Mode: UPDATE data existing');
            
            // Cari baris yang akan diupdate
            const findResponse = await gapi.client.sheets.spreadsheets.values.get({
                spreadsheetId: SHEET_ID,
                range: 'Sheet1!A:A', // Cari di kolom nama
            });
            
            const namaValues = findResponse.result.values;
            let rowIndex = -1;
            
            for (let i = 0; i < namaValues.length; i++) {
                if (namaValues[i] && namaValues[i][0] && 
                    namaValues[i][0].toString().trim() === currentParticipantData[0].toString().trim()) {
                    rowIndex = i + 1; // +1 karena header
                    break;
                }
            }
            
            if (rowIndex !== -1) {
                // Update baris yang ditemukan
                const range = `Sheet1!A${rowIndex}:M${rowIndex}`;
                
                await gapi.client.sheets.spreadsheets.values.update({
                    spreadsheetId: SHEET_ID,
                    range: range,
                    valueInputOption: 'RAW',
                    resource: {
                        values: [rowData]
                    }
                });
                
                return { 
                    success: true, 
                    message: 'Data berhasil diupdate di Google Sheets' 
                };
            } else {
                throw new Error('Data tidak ditemukan untuk diupdate');
            }
            
        } else {
            // TAMBAH DATA BARU
            console.log('Mode: TAMBAH data baru');
            
            await gapi.client.sheets.spreadsheets.values.append({
                spreadsheetId: SHEET_ID,
                range: 'Sheet1!A:M',
                valueInputOption: 'RAW',
                resource: {
                    values: [rowData]
                }
            });
            
            return { 
                success: true, 
                message: 'Data baru berhasil ditambahkan ke Google Sheets' 
            };
        }
        
    } catch (error) {
        console.error('Error saving directly to sheets:', error);
        
        // Fallback: coba dengan fetch API
        try {
            console.log('Mencoba fallback dengan fetch API...');
            return await saveWithFetchAPI(data);
        } catch (fallbackError) {
            console.error('Fallback juga gagal:', fallbackError);
            
            // Final fallback: localStorage
            return await saveToLocalStorage(data);
        }
    }
}

// Fallback dengan Fetch API
async function saveWithFetchAPI(data) {
    const isUpdate = !isNewRegistration && currentParticipantData;
    const rowData = [
        data.nama,
        data.satker,
        data.status,
        data.agama,
        data.grade,
        data.jenis_kelamin,
        data.jabatan,
        data.pangkat,
        data.whatsapp,
        data.konfirmasi_kehadiran,
        data.jumlah_tamu,
        data.data_tamu,
        new Date().toISOString()
    ];
    
    if (isUpdate && currentParticipantData) {
        // Logic untuk update dengan fetch API
        // ... (implementasi serupa dengan gapi client)
    } else {
        // Append data baru
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1!A:M:append?valueInputOption=RAW&key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                values: [rowData]
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return { success: true, message: 'Data berhasil disimpan (fetch API)' };
    }
}

// Fungsi-fungsi bantu (tetap sama)
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

function validateFormData(data) {
    const requiredFields = ['nama', 'satker', 'status', 'agama', 'grade', 'jenis_kelamin', 'jabatan', 'pangkat', 'whatsapp', 'konfirmasi_kehadiran'];
    
    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showStatusMessage(`Field ${getFieldLabel(field)} harus diisi`, 'error');
            document.getElementById(field).focus();
            return false;
        }
    }
    
    const whatsappRegex = /^[0-9]{10,15}$/;
    const cleanWhatsapp = data.whatsapp.replace(/\D/g, '');
    if (!whatsappRegex.test(cleanWhatsapp)) {
        showStatusMessage('Nomor WhatsApp tidak valid. Minimal 10 digit angka.', 'error');
        document.getElementById('whatsapp').focus();
        return false;
    }
    
    return true;
}

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

function generateQRCode(data) {
    return new Promise((resolve, reject) => {
        const qrContainer = document.getElementById('qrcode');
        qrContainer.innerHTML = '';
        
        const qrData = {
            i: generateUniqueId(),
            n: data.nama.substring(0, 30),
            w: data.whatsapp,
            t: Date.now(),
            j: data.jumlah_tamu
        };
        
        const qrDataString = JSON.stringify(qrData);
        console.log('QR Code data length:', qrDataString.length);
        console.log('QR Code data:', qrDataString);
        
        try {
            qrCodeInstance = new QRCode(qrContainer, {
                text: qrDataString,
                width: 160,
                height: 160,
                colorDark: "#1a472a",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.L
            });
            
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
            
            setTimeout(() => {
                const canvas = qrContainer.querySelector('canvas');
                if (canvas) {
                    qrCodeDataUrl = canvas.toDataURL('image/png');
                    setupQRCodeButtons(data);
                    resolve();
                } else {
                    reject(new Error('Canvas tidak ditemukan'));
                }
            }, 200);
            
        } catch (error) {
            console.error('Error generating QR Code:', error);
            reject(new Error('Gagal membuat QR Code: ' + error.message));
        }
    });
}

function generateUniqueId() {
    return 'N' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function setupQRCodeButtons(data) {
    const downloadBtn = document.getElementById('download-qr');
    const whatsappBtn = document.getElementById('share-whatsapp');
    
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

function resetForm() {
    document.getElementById('registration-form').reset();
    document.getElementById('qr-container').style.display = 'none';
    document.getElementById('nama-search').value = '';
    currentParticipantData = null;
    qrCodeDataUrl = '';
    isNewRegistration = false;
    
    const resetFields = ['nama', 'satker', 'status', 'agama', 'grade', 'jenis_kelamin', 'jabatan', 'pangkat', 'whatsapp', 'konfirmasi_kehadiran', 'jumlah_tamu', 'data_tamu'];
    resetFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.value = '';
            element.readOnly = false;
            element.disabled = false;
        }
    });
    
    document.getElementById('konfirmasi_kehadiran').value = 'Hadir';
    document.getElementById('jumlah_tamu').value = '0';
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    showStatusMessage('Form telah direset. Silakan cari nama Anda atau isi data manual.', 'info');
}

function showStatusMessage(message, type = 'info') {
    const statusElement = document.getElementById('status-message');
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status-message ${type}`;
        statusElement.style.display = 'block';
        
        if (type === 'success' || type === 'info') {
            setTimeout(() => {
                statusElement.style.display = 'none';
            }, 5000);
        }
    }
}

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

window.addEventListener('online', function() {
    showStatusMessage('Koneksi internet pulih.', 'success');
    setTimeout(hideStatusMessage, 3000);
});

window.addEventListener('offline', function() {
    showStatusMessage('Anda sedang offline. Beberapa fitur mungkin tidak berfungsi.', 'warning');
});
