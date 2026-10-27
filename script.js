// Fungsi untuk navigasi antar tab
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    
    if (event && event.target && event.target.classList.contains('nav-btn')) {
        event.target.classList.add('active');
    }
}

// Fungsi Mengirim Laporan & Membuat Token Otomatis
function handleReportSubmit(event) {
    event.preventDefault();

    const incidentType = document.getElementById('incidentType').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const identity = document.getElementById('identity').value || 'Anonim';

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const token = `#BL-${randomNum}`;

    const reportData = {
        token: token,
        type: incidentType,
        location: location,
        description: description,
        identity: identity,
        status: 'Menunggu Ditinjau',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };

    let reports = JSON.parse(localStorage.getItem('safeReports')) || [];
    reports.push(reportData);
    localStorage.setItem('safeReports', JSON.stringify(reports));

    document.getElementById('generatedToken').innerText = token;
    document.getElementById('resultModal').classList.remove('hidden');
    document.getElementById('bullyingForm').reset();
}

function closeModal() {
    document.getElementById('resultModal').classList.add('hidden');
    switchTabExplicit('track');
}

function switchTabExplicit(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
}

// Fungsi Melacak Status Laporan oleh Siswa
function trackReport() {
    const inputToken = document.getElementById('trackInput').value.trim().toUpperCase();
    const resultDiv = document.getElementById('trackResult');

    if (!inputToken) {
        alert('Mohon masukkan kode token terlebih dahulu!');
        return;
    }

    let reports = JSON.parse(localStorage.getItem('safeReports')) || [];
    const foundReport = reports.find(rep => rep.token === inputToken);

    resultDiv.classList.remove('hidden');

    if (foundReport) {
        resultDiv.innerHTML = `
            <h3>Status untuk Token: <strong>${foundReport.token}</strong></h3>
            <p><strong>Tanggal Laporan:</strong> ${foundReport.date}</p>
            <p><strong>Jenis Kejadian:</strong> ${foundReport.type}</p>
            <p><strong>Lokasi:</strong> ${foundReport.location}</p>
            <p><strong>Status Saat Ini:</strong> <span style="color: var(--primary); font-weight: bold;">${foundReport.status}</span></p>
            <hr style="margin: 1rem 0; border: 0; border-top: 1px solid var(--border-color);">
            <p style="font-size: 0.9rem; color: #64748b;">Laporanmu sedang dipantau secara rahasia. Siswa hanya dapat melihat status, tanpa izin untuk mengubahnya.</p>
        `;
    } else {
        resultDiv.innerHTML = `
            <p style="color: #b91c1c; font-weight: bold;">Token tidak ditemukan!</p>
            <p style="font-size: 0.9rem; color: #64748b; margin-top: 0.5rem;">Pastikan kode token yang kamu masukkan sudah benar (contoh: #BL-xxxx).</p>
        `;
    }
}

// Fitur Validasi Emosi Mandiri (Self-Help Venting)
function giveValidation() {
    const ventText = document.getElementById('ventInput').value.trim();
    const outputDiv = document.getElementById('validationResponse');

    if (!ventText) {
        alert('Tuliskan sedikit perasaanmu terlebih dahulu.');
        return;
    }

    const validations = [
        "Apa yang kamu rasakan itu nyata dan valid. Tidak apa-apa merasa sedih atau marah, tapi ingat bahwa perbuatan buruk mereka bukan cerminan dari dirimu.",
        "Kamu sudah sangat hebat karena bertahan sampai detik ini. Tarik napas dalam-dalam, lepaskan beban itu perlahan—kamu berharga.",
        "Perundungan yang mereka lakukan adalah kesalahan mereka, bukan kelemahanmu. Kamu berhak mendapatkan lingkungan yang aman dan penuh dukungan.",
        "Meskipun terasa berat saat ini, perasaan ini akan berlalu. Kamu tidak sendirian, dan suaramu sudah mulai didengar di sini."
    ];

    const randomValidation = validations[Math.floor(Math.random() * validations.length)];

    outputDiv.classList.remove('hidden');
    outputDiv.innerHTML = `
        <strong>✨ Pesan untuk Kamu:</strong>
        <p style="margin-top: 0.5rem;">${randomValidation}</p>
    `;

    document.getElementById('ventInput').value = '';
}

// --- SISTEM KEAMANAN & PANEL ADMIN (GURU) ---

function verifyAdmin() {
    const passInput = document.getElementById('adminPass').value;
    const errorText = document.getElementById('loginError');

    if (passInput === 'guru123') {
        errorText.style.display = 'none';
        document.getElementById('loginCard').classList.add('hidden');
        document.getElementById('adminDashboard').classList.remove('hidden');
        loadAdminReports();
        document.getElementById('adminPass').value = '';
    } else {
        errorText.style.display = 'block';
    }
}

function logoutAdmin() {
    document.getElementById('adminDashboard').classList.add('hidden');
    document.getElementById('loginCard').classList.remove('hidden');
}

function loadAdminReports() {
    const container = document.getElementById('adminReportsList');
    let reports = JSON.parse(localStorage.getItem('safeReports')) || [];

    if (reports.length === 0) {
        container.innerHTML = `<p style="color: #64748b; text-align: center; padding: 2rem;">Belum ada laporan masuk.</p>`;
        return;
    }

    let html = '';
    reports.slice().reverse().forEach((rep, index) => {
        const originalIndex = reports.length - 1 - index;

        html += `
            <div class="admin-report-card">
                <h4>Token: ${rep.token}</h4>
                <p><strong>Tanggal:</strong> ${rep.date} | <strong>Pelapor:</strong> ${rep.identity}</p>
                <p><strong>Jenis:</strong> ${rep.type} | <strong>Lokasi:</strong> ${rep.location}</p>
                <p style="margin-top: 0.5rem;"><strong>Kronologi:</strong> ${rep.description}</p>
                <p style="margin-top: 0.5rem;"><strong>Status Saat Ini:</strong> <span style="color: var(--primary);">${rep.status}</span></p>
                
                <div class="status-changer-box">
                    <label style="font-size: 0.85rem; margin:0;">Ubah Status:</label>
                    <select id="statusSelect-${originalIndex}">
                        <option value="Menunggu Ditinjau" ${rep.status === 'Menunggu Ditinjau' ? 'selected' : ''}>Menunggu Ditinjau</option>
                        <option value="Sedang Ditinjau" ${rep.status === 'Sedang Ditinjau' ? 'selected' : ''}>Sedang Ditinjau</option>
                        <option value="Pelaku Sedang Ditindaklanjuti" ${rep.status === 'Pelaku Sedang Ditindaklanjuti' ? 'selected' : ''}>Pelaku Sedang Ditindaklanjuti</option>
                        <option value="Kasus Selesai / Ditutup" ${rep.status === 'Kasus Selesai / Ditutup' ? 'selected' : ''}>Kasus Selesai / Ditutup</option>
                    </select>
                    <button onclick="updateReportStatus(${originalIndex})" class="cta-btn">Simpan Status</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function updateReportStatus(index) {
    const selectElement = document.getElementById(`statusSelect-${index}`);
    const newStatus = selectElement.value;

    let reports = JSON.parse(localStorage.getItem('safeReports')) || [];
    if (reports[index]) {
        reports[index].status = newStatus;
        localStorage.setItem('safeReports', JSON.stringify(reports));
        alert('Status laporan berhasil diperbarui!');
        loadAdminReports();
    }
}
