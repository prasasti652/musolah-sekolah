// Mengambil data absensi dari memori browser (localStorage)
let dataAbsensi = JSON.parse(localStorage.getItem('absensiMushola')) || [];

// ==========================================================================
// 1. LOGIKA UNTUK HALAMAN REKAP (index.html)
// ==========================================================================
const elTotalHadir = document.getElementById('totalHadir');
if (elTotalHadir) {
    // Tampilkan tanggal hari ini secara otomatis
    const opsiTanggal = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('tanggalHariIni').innerText = new Date().toLocaleDateString('id-ID', opsiTanggal);

    renderRekapAbsen("SEMUA");

    // Aktifkan filter kelas
    const filterKelas = document.getElementById('filterKelas');
    filterKelas.addEventListener('change', function() {
        renderRekapAbsen(this.value);
    });
}

function renderRekapAbsen(filter) {
    let countDzuhur = 0;
    let countDhuha = 0;

    // Hitung total keseluruhan hari ini
    dataAbsensi.forEach(item => {
        if (item.sholat === 'Sholat Dzuhur') countDzuhur++;
        else if (item.sholat === 'Sholat Dhuha') countDhuha++;
    });

    document.getElementById('totalHadir').innerText = dataAbsensi.length + " Siswa";
    document.getElementById('totalDzuhur').innerText = countDzuhur + " Siswa";
    document.getElementById('totalDhuha').innerText = countDhuha + " Siswa";

    // Filter data untuk tabel
    const dataTampil = filter === "SEMUA" 
        ? dataAbsensi 
        : dataAbsensi.filter(item => item.kelas.includes(filter));

    const tabelAbsensi = document.getElementById('tabelAbsensi');
    tabelAbsensi.innerHTML = "";

    if (dataTampil.length === 0) {
        tabelAbsensi.innerHTML = `<tr><td colspan="3" class="table-empty">Belum ada data kehadiran untuk kategori ini.</td></tr>`;
        return;
    }

    dataTampil.forEach(item => {
        let badgeClass = 'status-tepat';
        if (item.status === 'Masbuk') badgeClass = 'status-masbuk';
        if (item.status === "Udzur Syar'i") badgeClass = 'status-udzur';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div style="font-weight:700;">${item.nama}</div>
                <div style="font-size:10px; color:#647870;">${item.kelas} • Pukul ${item.jam}</div>
            </td>
            <td style="font-weight:600; font-size:11px;">${item.sholat}</td>
            <td class="text-right"><span class="status-badge ${badgeClass}">${item.status}</span></td>
        `;
        tabelAbsensi.appendChild(row);
    });
}

// ==========================================================================
// 2. LOGIKA UNTUK HALAMAN FORM ABSEN (form.html)
// ==========================================================================
const btnKirimAbsen = document.getElementById('btnKirimAbsen');

if (btnKirimAbsen) {
    btnKirimAbsen.addEventListener('click', function() {
        const nama = document.getElementById('namaSiswa').value.trim();
        const kelas = document.getElementById('kelasSiswa').value;
        const sholat = document.getElementById('jenisSholat').value;
        const status = document.getElementById('statusHadir').value;

        if (nama === "" || kelas === "" || sholat === "") {
            alert("Mohon lengkapi Nama Siswa, Kelas, dan Jenis Sholat terlebih dahulu!");
            return;
        }

        // Ambil jam saat ini (Contoh: 12:30)
        const sekarang = new Date();
        const jam = sekarang.getHours().toString().padStart(2, '0') + ":" + 
                    sekarang.getMinutes().toString().padStart(2, '0');

        // Simpan ke localStorage
        dataAbsensi.unshift({
            nama: nama,
            kelas: kelas,
            sholat: sholat,
            status: status,
            jam: jam
        });
        localStorage.setItem('absensiMushola', JSON.stringify(dataAbsensi));

        alert(`Alhamdulillah, absensi "${nama}" (${kelas}) untuk ${sholat} berhasil dicatat pada pukul ${jam}!`);
        window.location.href = "index.html";
    });
}