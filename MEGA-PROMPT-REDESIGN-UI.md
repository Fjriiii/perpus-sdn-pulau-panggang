# MEGA PROMPT — REDESIGN UI SISTEM PERPUSTAKAAN
## SDN Pulau Panggang 02 Pagi
## Target: Codex + Antigravity IDE

---

## KONTEKS PROYEK

Ini adalah proyek redesign UI untuk sistem informasi perpustakaan SDN Pulau Panggang 02 Pagi.
Backend Laravel 11 + REST API sudah selesai dan TIDAK BOLEH DIUBAH.
Yang diubah HANYA lapisan frontend React (semua file .jsx, .css, tailwind config).
Tujuan: mengganti desain lama yang terlalu "AI generated" menjadi desain baru yang lebih
bersih, terang, mudah dibaca, dan mencerminkan identitas SDN (warna merah).

---

## DESIGN SYSTEM — WAJIB DITERAPKAN DI SELURUH HALAMAN

### 1. COLOR PALETTE

Terapkan sebagai CSS variables di `src/index.css` atau sebagai extend di `tailwind.config.js`:

```css
:root {
  /* Primary — Merah SDN */
  --red:          #C0392B;
  --red-dark:     #96281B;
  --red-mid:      #E74C3C;
  --red-light:    #FDECEA;

  /* Accent — Emas/Gold */
  --gold:         #D4A017;
  --gold-dark:    #B8870F;
  --gold-light:   #FDF6DC;

  /* Background */
  --bg:           #FDF8F7;
  --white:        #FFFFFF;

  /* Border */
  --border:       #E8D5D3;
  --border-strong:#C0392B;

  /* Text */
  --text:         #1A0A09;
  --text-sec:     #6B4040;
  --text-muted:   #9E6B6B;

  /* Status — Tersedia */
  --success:      #0F7B55;
  --success-bg:   #E8F7F1;
  --success-border:#7ECDB5;

  /* Status — Dipinjam/Error */
  --danger:       #B91C1C;
  --danger-bg:    #FEE2E2;
  --danger-border:#FCA5A5;

  /* Status — Pending/Warning */
  --warning:      #D4A017;
  --warning-bg:   #FDF6DC;
  --warning-border:#F0D080;

  /* Info */
  --info:         #1D4ED8;
  --info-bg:      #EFF6FF;
  --info-border:  #93C5FD;
}
```

Untuk Tailwind, extend di `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      red: { DEFAULT: '#C0392B', dark: '#96281B', mid: '#E74C3C', light: '#FDECEA' },
      gold: { DEFAULT: '#D4A017', dark: '#B8870F', light: '#FDF6DC' },
      brand: { bg: '#FDF8F7', border: '#E8D5D3' },
    }
  }
}
```

---

### 2. TYPOGRAPHY

Install dan gunakan dari Google Fonts di `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Nunito:wght@700;800&display=swap" rel="stylesheet">
```

Terapkan di CSS global:
```css
body {
  font-family: 'DM Sans', sans-serif;
  font-size: 15px;           /* JANGAN lebih kecil dari ini */
  color: #1A0A09;
  background: #FDF8F7;
}

h1, h2, h3, .brand {
  font-family: 'Nunito', sans-serif;
}
```

**Ukuran font minimum:**
- Body / label biasa: **15px**
- Caption / badge: **12px** (tidak boleh lebih kecil)
- Judul kartu buku: **14px bold**
- Heading section: **19–20px bold (Nunito)**
- Heading halaman / hero: **26–30px bold (Nunito)**

---

### 3. ICON — LUCIDE REACT

Gunakan HANYA Lucide React (sudah terinstall). Import per komponen:
```jsx
import { Search, BookOpen, Library, Lock, Clock,
         CheckCircle2, BookMarked, Bookmark, BookX,
         Users, BarChart3, AlertTriangle, LogOut,
         ChevronRight, Bell, Settings, Lightbulb } from 'lucide-react'
```

**Ukuran icon:**
- Icon di navbar / button kecil: `size={16}`
- Icon di kartu info / section: `size={22}`
- Icon di empty state: `size={40}`
- Icon di hero tag: `size={14}`

---

### 4. BORDER & SPACING

```
Border kartu:        2px solid #E8D5D3  (hover: 2px solid #C0392B)
Border radius kartu: 13px
Border radius badge: 20px (pill)
Border radius button: 8px
Border navbar bawah: 2.5px solid #C0392B
Padding kartu buku:  13px
Gap grid kartu:      13px
```

---

## KOMPONEN GLOBAL YANG HARUS DIBUAT

Buat file-file ini di `src/components/ui/`:

### `Badge.jsx`
```jsx
// Props: variant = 'success' | 'danger' | 'warning' | 'info' | 'default'
//        size = 'sm' | 'md'
//        children
// Border selalu 1.5px solid, pill shape, font bold
```

### `StatCard.jsx`
```jsx
// Props: label, value, icon, iconBg = 'red' | 'gold' | 'green'
// Border 2px solid #E8D5D3, border-radius 12px
// Icon container: 46x46px, border-radius 10px, border 2px solid sesuai warna
// Value: Nunito 800, 21px
// Label: DM Sans 500, 12px, color: var(--text-muted)
```

### `SectionTitle.jsx`
```jsx
// Render: garis merah vertikal 4x22px + teks Nunito 800 19px
// Props: children, count (opsional, tampil sebagai badge merah muda di kanan)
```

### `BookCard.jsx`
```jsx
// Props: title, author, category, year, isAvailable, onReserve
// Cover area: 96px tinggi, emoji/ikon tengah, background sesuai kategori
// Border bottom tombol: tidak ada — gunakan margin-top saja
// Tombol "Pesan Buku": merah penuh, lebar 100%, rounded-8px
// Tombol "Stok Habis": abu-abu disabled, border 2px
// Hover seluruh card: border berubah ke merah, translateY(-3px)
```

---

## HALAMAN 1 — BERANDA / OPAC (HomePage.jsx)

### Navbar
```
- Background: putih (#FFFFFF)
- Border bawah: 2.5px solid #C0392B
- Tinggi: 60px
- Kiri: Logo (kotak merah 34x34 berisi icon Library putih) + teks brand Nunito 800 merah
- Tengah: Link navigasi (Cari Buku, Koleksi Terbaru, Tata Tertib, Cek Pinjaman)
  - Active state: background #FDECEA, teks merah, font bold
  - Hover state: background #FDECEA, teks merah
- Kanan: Tombol "Login Admin" merah solid, icon Lock 14px
```

### Hero Section
```
- Background: #C0392B solid (merah SDN)
- Padding: 36px atas, 44px bawah
- Tag atas: pill transparan putih, border putih transparan
  → isi: "90 Judul · 255 Eksemplar · 10 Kategori"
- Heading: Nunito 800, 28px, putih. Baris 2: kuning #FFD700
- Subtext: 15px, putih 85% opacity
- Search box:
  - Background putih, border-radius 12px, border 2.5px putih transparan
  - Input teks (flex:1) + divider vertikal + select kategori + tombol CARI emas (#D4A017)
  - Placeholder: abu-abu terang
- Chip tokens: muncul di bawah search box, pill putih transparan
- Hint Smart Search: teks kecil putih 70% opacity + icon Lightbulb
```

### Info Strip (3 kartu di bawah hero)
```
Kartu 1: icon Books merah → "Total Koleksi — 90 Judul"
Kartu 2: icon CheckCircle2 hijau → "Total Eksemplar — 255 Buku"
Kartu 3: icon Clock emas → "Durasi Pinjam — 7 Hari"
Semua: border 2px solid #E8D5D3, border-radius 12px, background putih
```

### Grid Buku
```
- grid-template-columns: repeat(auto-fill, minmax(175px, 1fr))
- gap: 13px
- Section title: garis merah + "Hasil Pencarian" + badge count merah muda
```

### Warna Cover Kartu per Kategori DDC:
```
000 Karya Umum/Komputer    → background #EFF6FF  (biru muda)
100 Filsafat & Psikologi   → background #EDE9FE  (ungu muda)
200 Agama                  → background #FDF6DC  (emas muda)
300 Ilmu Sosial            → background #FDF6DC  (emas muda)
400 Bahasa                 → background #ECFEFF  (teal muda)
500 Sains & Matematika     → background #ECFDF5  (hijau muda)
600 Teknologi              → background #ECFEFF  (teal muda)
700 Seni & Rekreasi        → background #FDF2F8  (pink muda)
800 Sastra                 → background #FDF2F8  (pink muda)
900 Sejarah & Geografi     → background #EFF6FF  (biru muda)
```

---

## HALAMAN 2 — KOLEKSI TERBARU (CollectionPage.jsx)

```
- Sama persis dengan HomePage grid buku
- Tanpa hero search — langsung section title + grid
- Section title: "20 Buku Terbaru Ditambahkan"
- Tambahkan tag "BARU" di pojok kanan atas kartu (emas, pill kecil)
```

---

## HALAMAN 3 — TATA TERTIB (RulesPage.jsx)

```
- Layout: grid 2 kolom pada desktop, 1 kolom pada mobile
- Setiap kartu aturan:
  - Border kiri: 4px solid #C0392B
  - Border: 2px solid #E8D5D3
  - Heading kartu: merah, Nunito 700, icon Lucide di kiri
  - List item: font 15px, line-height longgar
- Kartu lokasi & jam operasional: background #FDECEA, border merah
- Kartu peringatan (denda, dll): background #FDF6DC, border emas
```

---

## HALAMAN 4 — CEK PINJAMAN (CheckLoanPage.jsx)

```
- Kartu form di tengah, max-width 500px
- Input NISN: border 2px, padding 12px, font 15px, focus border merah
- Tombol "Cek Sekarang": merah penuh, lebar 100%, font 15px bold
- Hasil tabel:
  - Header tabel: background #FDECEA, teks merah bold
  - Badge status: "Aktif" → hijau, "Terlambat X hari" → merah, "Menunggu Approval" → emas
```

---

## HALAMAN 5 — LOGIN ADMIN (LoginPage.jsx)

```
- Halaman full-height dengan background #FDF8F7
- Kartu login di tengah, max-width 380px
  - Border 2px solid #E8D5D3, border-radius 14px
  - Logo: kotak merah 60x60px, border-radius 14px, icon Library putih 28px
  - Judul "Login Admin": Nunito 800
  - Sub: "Petugas Perpustakaan SDN Pulau Panggang 02 Pagi"
  - Input: border 2px, padding 10px 14px, focus border merah + shadow merah 10%
  - Tombol login: background merah, hover merah gelap, font 15px bold
  - Error state: background #FEE2E2, border #FCA5A5, teks merah
```

---

## HALAMAN 6 — DASHBOARD ADMIN (DashboardPage.jsx)

### Stat Cards (5 kartu)
```
Kartu 1: icon BookMarked merah      → "Total Buku — [N] Judul"
Kartu 2: icon Users biru            → "Anggota Aktif — [N] Siswa"
Kartu 3: icon Clock emas            → "Sedang Dipinjam — [N]"
Kartu 4: icon AlertTriangle merah   → "Terlambat — [N]" (teks merah jika > 0)
Kartu 5: icon Bell emas             → "Menunggu Approval — [N]" (badge merah jika > 0)
```

### Tabel Overdue
```
- Judul section: icon AlertTriangle merah + "Peminjaman Terlambat"
- Header tabel: background #FDECEA
- Kolom "Hari Terlambat": badge merah
- Jika kosong: empty state hijau "Tidak ada peminjaman terlambat ✓"
```

### Analytics Smart Search (jika ada endpoint /api/admin/analytics/search)
```
- Section "Analitik Smart Search"
- Tampilkan: total pencarian, rata-rata token, kata kunci terpopuler
- Gunakan komponen bar sederhana dari data search_logs
- Font angka: Nunito 800, ukuran besar
```

---

## HALAMAN 7 — PERMINTAAN PINJAM (RequestsPage.jsx)

```
- Badge "N Menunggu" di header: merah, Nunito bold
- Tabel:
  - Header: background #FDECEA
  - Badge status: "⏳ Menunggu" emas | "✅ Disetujui" hijau | "❌ Ditolak" merah
  - Tombol "Setujui": hijau solid, ikon CheckCircle2
  - Tombol "Tolak": outline merah, ikon X
- Modal WA Log (setelah approve):
  - Header: hijau
  - Pre block: background #E8F7F1, border hijau, font monospace 13px
  - Catatan bawah: italic, kecil, abu-abu
```

---

## HALAMAN 8 — MANAJEMEN BUKU (BooksPage.jsx)

```
- Search bar + dropdown kategori: border 2px, padding yang nyaman
- Tombol "+ Tambah Buku": merah solid
- Tabel:
  - Header: background #FDECEA, teks merah bold
  - Badge stok: hijau jika tersedia, merah jika semua dipinjam
  - Tombol Edit: ghost dengan border, icon Pencil
  - Tombol Hapus: outline merah tipis, icon Trash2
- Pagination: active page background merah, teks putih
- Modal form:
  - Header merah
  - Input focus: border merah, shadow merah ringan
  - Tombol simpan: merah
```

---

## HALAMAN 9 — MANAJEMEN ANGGOTA (MembersPage.jsx)

```
- Sama pola dengan BooksPage
- Badge kelas: pill emas (gold-light bg, gold border)
- Badge pinjaman aktif: pill biru jika ada, pill hijau jika tidak ada
- Tombol "+ Tambah Anggota": merah solid
```

---

## HALAMAN 10 — PEMINJAMAN (LoansPage.jsx)

```
- Tombol "+ Pinjam Buku": emas (#D4A017), teks putih
- Tabel status badge:
  - "Aktif": biru
  - "Terlambat": merah
  - "Dikembalikan": hijau
- Modal form pinjam:
  - Select anggota + select buku: border 2px, padding 10px
  - Tanggal kembali: read-only, background #F5F5F5
  - Tombol: emas
```

---

## HALAMAN 11 — PENGEMBALIAN (ReturnsPage.jsx)

```
- Header section: "Peminjaman Aktif (Belum Dikembalikan)"
- Badge per baris: "Aktif" biru / "Terlambat" merah
- Tombol "↩ Kembalikan": hijau solid, icon CornerDownLeft atau RotateCcw
- Empty state: centang hijau besar + "Tidak ada peminjaman aktif"
```

---

## SIDEBAR ADMIN

```
- Background: #96281B (merah gelap)
- Item active: background rgba(255,255,255,0.15), border kiri 3px solid #FFD700 (emas)
- Item hover: background rgba(255,255,255,0.08)
- Teks: putih 75% opacity, active: putih 100%
- Badge pending (untuk menu Permintaan Pinjam): lingkaran merah terang, teks putih, 18px
- Tombol logout: border atas putih transparan, teks putih 60%
```

---

## MODAL RESERVASI BUKU (Dari halaman publik)

```
- Overlay: rgba(0,0,0,0.5)
- Modal: max-width 500px, border-radius 13px
- Header: background merah (#C0392B), teks putih, icon BookOpen putih
- Book info box: background #FDECEA, border 1.5px solid #F5B7B1, border-radius 8px
- Input fields: border 2px solid #E8D5D3, focus border merah
- Tanggal (readonly): background #F5F5F5
- Tombol "Ajukan": emas (#D4A017), full width, 15px bold
- Tombol "Batal": ghost, border #E8D5D3
```

## MODAL SUKSES RESERVASI

```
- Icon centang besar: lingkaran hijau 60px, checkmark putih
- Heading: Nunito 800 "Permintaan Terkirim!"
- Subtext: DM Sans 15px abu-abu
- Tombol OK: merah solid full width
```

---

## ATURAN UMUM YANG WAJIB DIIKUTI

1. **Tidak ada teks di bawah 12px** — minimum body 15px, caption 12px
2. **Semua border kartu minimal 2px** — tidak boleh 1px yang tipis dan tidak terlihat
3. **Setiap section heading wajib pakai garis merah vertikal** di kiri (4x22px)
4. **Hover state semua kartu interaktif**: border berubah merah + translateY(-3px)
5. **Focus state semua input**: border merah + box-shadow rgba(192,57,43,0.15)
6. **Warna merah (#C0392B) HANYA untuk elemen aktif/primary** — jangan dipakai sebagai background besar selain hero dan header modal
7. **Emas (#D4A017) untuk aksi sekunder** — tombol pinjam manual, aksen chart, badge tertentu
8. **Empty state wajib ada** di setiap halaman yang bisa kosong, dengan icon Lucide ukuran 40px dan teks 15px
9. **Konsistensi tabel**: header selalu background #FDECEA, border antar baris #E8D5D3
10. **Tidak ada shadow besar/dramatic** — gunakan border sebagai pengganti shadow untuk kesan bersih

---

## FILE YANG HARUS DIUBAH

```
frontend/
├── index.html                    ← tambah Google Fonts link
├── src/
│   ├── index.css                 ← tambah CSS variables + global typography
│   ├── App.jsx                   ← tidak ada perubahan logika
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx        ← redesign total
│   │   │   └── Sidebar.jsx       ← redesign total (admin)
│   │   └── ui/
│   │       ├── BookCard.jsx      ← redesign total
│   │       ├── Badge.jsx         ← redesign total
│   │       ├── StatCard.jsx      ← redesign total
│   │       ├── Modal.jsx         ← redesign total
│   │       └── SectionTitle.jsx  ← komponen baru
│   └── pages/
│       ├── public/
│       │   ├── HomePage.jsx      ← redesign total
│       │   ├── CollectionPage.jsx← redesign total
│       │   ├── RulesPage.jsx     ← redesign total
│       │   └── CheckLoanPage.jsx ← redesign total
│       └── admin/
│           ├── LoginPage.jsx     ← redesign total
│           ├── DashboardPage.jsx ← redesign total
│           ├── RequestsPage.jsx  ← redesign total
│           ├── BooksPage.jsx     ← redesign total
│           ├── MembersPage.jsx   ← redesign total
│           ├── LoansPage.jsx     ← redesign total
│           └── ReturnsPage.jsx   ← redesign total
```

## FILE YANG TIDAK BOLEH DIUBAH

```
backend/          ← SELURUH FOLDER BACKEND — JANGAN SENTUH
frontend/src/
├── services/api.js         ← jangan ubah baseURL dan logic
├── context/AuthContext.jsx ← jangan ubah logic auth
├── hooks/                  ← jangan ubah logic hooks
```

---

## CATATAN PENTING UNTUK AI (CODEX / ANTIGRAVITY)

- Redesign ini HANYA mengubah tampilan visual. Semua logika, state management,
  API call, dan routing TIDAK BOLEH DIUBAH.
- Jangan menghapus props, fungsi, atau import yang sudah ada — hanya ubah className
  dan struktur JSX untuk keperluan visual.
- Jika ada komponen yang menggunakan inline style lama (warna hijau gelap #1a5c3a),
  ganti ke variable CSS atau class Tailwind sesuai design system di atas.
- Pastikan responsive: halaman publik harus tetap terbaca di layar 375px (mobile).
- Kerjakan file per file, mulai dari: index.css → Navbar.jsx → BookCard.jsx →
  HomePage.jsx → kemudian halaman lain secara berurutan.

---

*Prompt ini dibuat untuk redesign UI Sistem Informasi Perpustakaan SDN Pulau Panggang 02 Pagi*
*Mahasiswa: Fajri Muammar — NPM: 50423445 — Universitas Gunadarma 2026*
