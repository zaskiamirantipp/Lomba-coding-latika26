// Fungsi untuk navigasi antar tab
function switchTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));

    const buttons = document.querySelectorAll('.nav-btn');
    buttons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    
    // Jika tombol diklik langsung dari event
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
    const token =
