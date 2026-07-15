# Mega Prompt Context Review - Sistem Perpustakaan SDN Pulau Panggang 02 Pagi

## Role Untuk Agent AI Reviewer

Anda adalah senior software engineer, UI/UX reviewer, dan technical auditor. Tugas Anda bukan langsung menulis ulang seluruh kode, tetapi melakukan evaluasi kritis terhadap project web yang sudah berjalan setelah update terakhir.

Output yang diharapkan:

1. Daftar hal yang sudah bagus.
2. Daftar kekurangan, bug, inkonsistensi, dan risiko teknis.
3. Rekomendasi perbaikan prioritas tinggi, sedang, dan rendah.
4. Evaluasi UI/UX halaman publik dan admin.
5. Evaluasi integrasi frontend-backend.
6. Evaluasi database, keamanan, deployment readiness, dan testing.
7. Saran konkret file mana yang sebaiknya diperbaiki, tanpa mengubah backend kecuali memang sangat diperlukan.

Gunakan bahasa Indonesia yang jelas, teknis, dan mudah saya pakai untuk diskusi project atau sidang.

---

## Identitas Project

Nama project:
Sistem Informasi Perpustakaan SDN Pulau Panggang 02 Pagi

Tujuan project:
Membuat sistem perpustakaan berbasis web dengan OPAC publik, Smart Search, reservasi buku, login admin, manajemen buku, anggota, peminjaman, pengembalian, dan permintaan peminjaman.

Stack:

- Backend: Laravel 11 REST API
- Auth backend: Laravel Sanctum token + middleware custom `AdminAuth`
- Frontend: React + Vite
- Styling: Tailwind CSS + CSS variables
- Icon: Lucide React
- Database aktif lokal: SQLite (`backend/database/database.sqlite`)
- API base URL frontend: `http://localhost:8000/api`
- FE lokal: `http://127.0.0.1:5173/`
- BE lokal: `http://127.0.0.1:8000/api`

Catatan penting:
Backend Laravel sudah dibuat dan secara prinsip tidak boleh diubah untuk redesign UI. Fokus review utama adalah kualitas web setelah frontend redesign, namun reviewer boleh menandai bug backend jika memengaruhi workflow.

---

## Kondisi Terakhir Setelah Update

Update UI terbaru sudah diterapkan pada frontend:

- Palet warna utama diganti menjadi merah SDN (`#C0392B`) dan aksen emas (`#D4A017`).
- Font global diganti ke DM Sans untuk body dan Nunito untuk heading.
- Layout publik dan admin sudah lebih terang, bersih, dan konsisten.
- Border card minimal 2px.
- Radius card sekitar 13px.
- Hover card interaktif: border merah + translateY.
- Tabel admin memakai header merah muda.
- Empty state sudah ditambahkan pada halaman yang bisa kosong.
- Modal reservasi, modal sukses, modal WA log, login, dashboard, dan sidebar admin sudah didesain ulang.
- Kartu buku sudah memiliki ikon kategori berbeda, bukan lagi satu ikon buku untuk semua.

Verifikasi terakhir:

- `npm run lint` berhasil.
- `npm run build` berhasil.
- FE merespons `200`.
- BE API `/api/books` merespons `200`.
- Halaman OPAC menampilkan 90 kartu buku dari backend.
- Mobile 375px pernah dicek dan tidak ada horizontal overflow pada halaman utama.

---

## Struktur Project Ringkas

Root:

```text
backend/
frontend/
README.md
TECHNICAL_MASTER_CONTEXT.md
MEGA_PROMPT_CONTEXT_REVIEW_AFTER_UI_UPDATE.md
```

Backend penting:

```text
backend/routes/api.php
backend/app/Http/Controllers/AuthController.php
backend/app/Http/Controllers/BookController.php
backend/app/Http/Controllers/DashboardController.php
backend/app/Http/Controllers/LoanController.php
backend/app/Http/Controllers/MemberController.php
backend/app/Http/Controllers/ReservationController.php
backend/app/Http/Controllers/ResearchController.php
backend/app/Http/Controllers/SmartSearchAnalyticsController.php
backend/app/Http/Middleware/AdminAuth.php
backend/app/Models/Admin.php
backend/app/Models/Book.php
backend/app/Models/Loan.php
backend/app/Models/Member.php
backend/app/Models/Reservation.php
backend/app/Models/SearchLog.php
backend/app/Services/SmartSearch/TokenizationBasedSearchEngine.php
backend/database/migrations/
```

Frontend penting:

```text
frontend/src/App.jsx
frontend/src/main.jsx
frontend/src/style.css
frontend/src/services/api.js
frontend/src/hooks/useSmartSearch.js
frontend/src/context/AuthContext.jsx
frontend/src/components/layout/Navbar.jsx
frontend/src/components/admin/Sidebar.jsx
frontend/src/components/admin/WaLogModal.jsx
frontend/src/components/ui/Badge.jsx
frontend/src/components/ui/BookCard.jsx
frontend/src/components/ui/Modal.jsx
frontend/src/components/ui/ReserveModal.jsx
frontend/src/components/ui/ReserveSuccessModal.jsx
frontend/src/components/ui/SectionTitle.jsx
frontend/src/components/ui/StatCard.jsx
frontend/src/pages/public/HomePage.jsx
frontend/src/pages/public/CollectionPage.jsx
frontend/src/pages/public/RulesPage.jsx
frontend/src/pages/public/CheckLoanPage.jsx
frontend/src/pages/admin/LoginPage.jsx
frontend/src/pages/admin/DashboardPage.jsx
frontend/src/pages/admin/RequestsPage.jsx
frontend/src/pages/admin/BooksPage.jsx
frontend/src/pages/admin/MembersPage.jsx
frontend/src/pages/admin/LoansPage.jsx
frontend/src/pages/admin/ReturnsPage.jsx
frontend/src/utils/categories.js
```

---

## Backend Context

Backend menyediakan REST API untuk:

- Auth admin login/logout.
- Public list buku.
- Public recent books.
- Public book detail.
- Public reservation request.
- Public cek pinjaman by NISN.
- Admin dashboard stats.
- Admin search analytics.
- Admin CRUD buku.
- Admin CRUD anggota.
- Admin list/create loan.
- Admin process return.
- Admin approve/reject reservation.
- Research report endpoint.

Auth:

- Admin login memakai username/password.
- Backend membuat token Sanctum.
- Token disimpan frontend di localStorage.
- Protected admin routes backend memakai middleware custom `AdminAuth`.
- Frontend protected route hanya mengecek token di localStorage; otorisasi sebenarnya tetap backend.

Database:

- Database aktif lokal saat ini SQLite, bukan MySQL/XAMPP MySQL.
- Tabel utama: admins, books, members, loans, reservations, search_logs.
- Ada tabel Laravel/Sanctum: users, sessions, personal_access_tokens, cache, jobs, migrations, dll.
- Data buku terisi sekitar 90 judul.
- Total eksemplar di dashboard backend pernah terbaca 255.

Smart Search:

- Implementasi saat ini tokenization-based search.
- Query di-lowercase, dipisah per kata, token pendek dibuang.
- Matching dilakukan ke title, author, category, publisher.
- Score dihitung dari jumlah token yang cocok.
- Search log disimpan ke `search_logs`.
- Ini bukan semantic search, bukan AI embedding, dan bukan NLP canggih.

WhatsApp:

- Approve reservation mengembalikan WA log/mock.
- Saat ini belum benar-benar mengirim pesan ke Fonnte/WhatsApp API.
- Modal WA log di frontend menampilkan simulasi payload/response.

---

## Frontend Context Setelah Redesign

Design system:

- `frontend/src/style.css` berisi CSS variables global:
  - `--red`, `--red-dark`, `--red-light`
  - `--gold`, `--gold-light`
  - `--bg`, `--border`, `--text`
  - status success/danger/warning/info
- Body:
  - DM Sans
  - font-size 15px
  - background `#FDF8F7`
- Heading:
  - Nunito
- Utility global:
  - `.app-card`
  - `.interactive-card`
  - `.input-control`
  - `.table-shell`
  - `.data-table`
  - `.empty-state`

Global components:

- `Badge.jsx`
  - Variant: default, success, danger, warning, info.
  - Masih mendukung prop lama `tone`.

- `StatCard.jsx`
  - Card statistik admin/dashboard.
  - Icon container 46x46.
  - Mendukung danger state.

- `SectionTitle.jsx`
  - Heading section dengan garis vertikal merah.
  - Mendukung count badge.

- `BookCard.jsx`
  - Kartu buku publik.
  - Menampilkan cover area kategori.
  - Icon kategori sudah berbeda:
    - Karya Umum: Shapes
    - Karya Umum/Komputer: Cpu
    - Filsafat & Psikologi: Brain
    - Agama: Landmark
    - Ilmu Sosial: Users
    - Bahasa: Languages
    - Sains: Atom
    - Sains & Matematika: Calculator
    - Teknologi dan Ilmu Terapan: Wrench
    - Kesenian & Rekreasi: Palette
    - Sastra: PenLine
    - Sejarah dan Geografi: Globe2
  - Tombol `Pesan Buku` aktif jika stok tersedia.
  - Tombol `Stok Habis` disabled jika tidak tersedia.

Halaman publik:

- `/`
  - OPAC + hero merah.
  - Search box dengan input, kategori, tombol CARI emas.
  - Info strip total koleksi, total eksemplar, durasi pinjam.
  - Grid buku.
  - Modal reservasi.

- `/koleksi`
  - Menampilkan 20 buku terbaru.
  - Kartu buku memakai badge BARU.

- `/tata-tertib`
  - Grid aturan.
  - Kartu lokasi/jam operasional.
  - Kartu perhatian.

- `/cek-pinjaman`
  - Form cek NISN.
  - Tabel hasil loan/reservation.
  - Badge status.

Halaman admin:

- `/admin/login`
  - Login card putih.
  - Logo merah.
  - Default form masih terisi `admin/admin123`.

- `/admin`
  - Dashboard stats.
  - Smart Search analytics.
  - Overdue loans table/empty state.

- `/admin/requests`
  - Tabel permintaan pinjam.
  - Approve/reject.
  - Modal WA log.

- `/admin/books`
  - Search + filter kategori.
  - Tabel buku.
  - Modal tambah/edit buku.
  - Delete dengan confirm browser.

- `/admin/members`
  - Search + filter kelas.
  - Tabel anggota.
  - Modal tambah/edit anggota.

- `/admin/loans`
  - Tabel peminjaman.
  - Modal pinjam manual.

- `/admin/returns`
  - Tabel peminjaman aktif.
  - Tombol kembalikan.
  - Empty state jika tidak ada pinjaman aktif.

---

## Integrasi Frontend-Backend

Frontend memakai Axios service:

```text
frontend/src/services/api.js
```

Base URL:

```text
http://localhost:8000/api
```

Alur penting:

- OPAC memanggil `GET /books`.
- Search OPAC memanggil `GET /books?q=...&category=...`.
- Koleksi terbaru memanggil `GET /books/recent`.
- Reservasi publik memanggil `POST /reservations`.
- Cek pinjaman memanggil `GET /members/check/{nisn}`.
- Login admin memanggil `POST /auth/login`.
- Logout memanggil `POST /auth/logout`.
- Dashboard admin memanggil `GET /admin/stats`.
- Buku admin memakai `/admin/books`.
- Anggota admin memakai `/admin/members`.
- Peminjaman admin memakai `/admin/loans`.
- Pengembalian memakai `POST /admin/loans/{id}/return`.
- Request admin memakai `/admin/reservations`.

Expected review:

- Pastikan semua operasi CRD benar-benar terkirim ke API.
- Pastikan perubahan data di admin memengaruhi halaman publik bila relevan.
- Pastikan token auth dikirim via Authorization Bearer.
- Pastikan error handling cukup manusiawi.

---

## Hal Yang Sudah Bagus Menurut Konteks Terakhir

Reviewer harus memvalidasi, tetapi baseline sementara:

1. Backend dan frontend sudah terpisah dengan REST API.
2. Public OPAC sudah mengambil data asli dari backend.
3. CRD admin memakai endpoint backend, bukan dummy state.
4. Smart Search sudah berjalan dan mencatat search log.
5. UI terbaru lebih konsisten, terang, dan sesuai identitas SDN merah.
6. Komponen UI global sudah mulai reusable.
7. Kartu buku sudah lebih visual melalui ikon kategori berbeda.
8. Dashboard admin sudah menampilkan stats, overdue, dan analytics.
9. Build frontend berhasil.
10. Lint frontend berhasil.

---

## Area Yang Perlu Direview Kritis

### UI/UX

Cek:

- Apakah ikon kategori benar-benar mudah dipahami oleh user SD?
- Apakah warna kategori cukup berbeda tanpa terasa terlalu ramai?
- Apakah kartu buku terlalu padat atau sudah nyaman?
- Apakah navbar publik terlalu penuh di mobile?
- Apakah halaman admin tetap nyaman dipakai untuk pekerjaan harian?
- Apakah modal form terlalu panjang di layar kecil?
- Apakah status badge mudah dibedakan?
- Apakah empty state sudah informatif?
- Apakah text hierarchy sudah tepat?
- Apakah desain masih terasa "AI generated" atau sudah natural?

### Accessibility

Cek:

- Contrast warna merah/emas terhadap background.
- Focus state keyboard.
- Label input.
- Button disabled state.
- Accessible name icon button edit/delete.
- Apakah badge hanya mengandalkan warna tanpa teks?
- Navigasi keyboard modal.

### Frontend Code Quality

Cek:

- Apakah class Tailwind terlalu panjang sehingga sulit maintain?
- Apakah ada duplikasi pola tabel/form yang sebaiknya jadi komponen?
- Apakah state modal `form !== emptyBook` / `form !== emptyMember` aman atau rapuh?
- Apakah pagination admin cukup baik?
- Apakah error API hanya ditelan tanpa feedback di beberapa halaman?
- Apakah loading state cukup di admin?
- Apakah delete confirm native browser cukup profesional?

### Backend/API

Cek:

- Apakah validasi backend sudah cukup?
- Apakah borrowed_qty bisa diedit manual dari form buku dan menyebabkan inkonsistensi?
- Apakah cascade delete pada members/books bisa menghapus histori loan yang penting?
- Apakah overdue sync sudah tepat?
- Apakah loan rules sesuai teks tata tertib?
- Apakah satu siswa boleh pinjam lagi saat masih ada active loan? Jika UI bilang tidak boleh, backend harus enforce.

### Auth/Security

Cek:

- Default login `admin/admin123` masih tampil/terisi di UI.
- Token disimpan di localStorage.
- Token Sanctum tidak tampak punya expiry ketat.
- Tidak ada rate limit khusus login.
- NISN dan nomor WA tersimpan plain.
- `APP_DEBUG=true` di local dev wajar, tetapi tidak boleh untuk production.
- CORS/security headers perlu dicek untuk deployment.

### Database/Deployment

Cek:

- Project lokal masih SQLite, bukan MySQL.
- Jika target hosting/production memakai MySQL, perlu migrasi konfigurasi.
- Belum ada CI/CD.
- Belum ada instruksi deployment production lengkap.
- WhatsApp/Fonnte masih mock, belum produksi.

### Testing

Cek:

- Backend test masih minim/template.
- Frontend belum punya automated UI test.
- Belum ada test CRD integrasi.
- Belum ada test auth/admin protection.
- Belum ada test Smart Search ranking.
- Belum ada test reservation approve/reject.

---

## Instruksi Review Yang Saya Inginkan

Lakukan review dengan format berikut:

```markdown
# Review Project Perpustakaan SDN Pulau Panggang

## Kesimpulan Singkat

## Yang Sudah Bagus
- ...

## Temuan Prioritas Tinggi
- [P1] Judul temuan
  - Dampak:
  - Bukti/file:
  - Saran perbaikan:

## Temuan Prioritas Sedang
- [P2] ...

## Temuan Prioritas Rendah
- [P3] ...

## Review UI/UX Per Halaman
- Beranda:
- Koleksi:
- Tata tertib:
- Cek pinjaman:
- Login admin:
- Dashboard admin:
- Permintaan pinjam:
- Manajemen buku:
- Manajemen anggota:
- Peminjaman:
- Pengembalian:

## Review Integrasi API

## Review Database

## Review Security

## Review Testing

## Rekomendasi Roadmap Perbaikan
1. Quick wins 1 hari
2. Perbaikan 2-3 hari
3. Perbaikan sebelum deployment/sidang

## Pertanyaan Potensial Dosen
- ...
```

---

## Batasan Untuk Agent Reviewer

1. Jangan menganggap project memakai MySQL aktif jika belum dibuktikan dari `.env`.
2. Jangan menganggap WhatsApp sudah benar-benar terkirim karena saat ini masih mock/simulasi.
3. Jangan menyebut Smart Search sebagai AI semantic search. Ini tokenization-based search.
4. Jangan menyarankan rewrite total jika masalah bisa diperbaiki incremental.
5. Prioritaskan rekomendasi yang realistis untuk project mahasiswa/penulisan ilmiah.
6. Jika menyarankan perubahan kode, sebutkan file spesifik dan risiko perubahan.
7. Bedakan antara "sudah berjalan", "masih mock", dan "belum production-ready".

---

## Commands Lokal Untuk Verifikasi

Backend:

```powershell
cd J:\webperpuscodexduaa\backend
C:\xampp\php\php.exe artisan serve --host=127.0.0.1 --port=8000
```

Frontend:

```powershell
cd J:\webperpuscodexduaa\frontend
npm.cmd run dev -- --host 127.0.0.1 --port 5173
```

Lint frontend:

```powershell
cd J:\webperpuscodexduaa\frontend
npm.cmd run lint
```

Build frontend:

```powershell
cd J:\webperpuscodexduaa\frontend
npm.cmd run build
```

Backend test:

```powershell
cd J:\webperpuscodexduaa\backend
C:\xampp\php\php.exe artisan test
```

API quick check:

```powershell
Invoke-WebRequest -UseBasicParsing -Uri "http://127.0.0.1:8000/api/books?skip_log=1"
```

---

## Pertanyaan Khusus Untuk Reviewer

Jawab pertanyaan ini secara eksplisit:

1. Apakah desain terbaru sudah cukup mencerminkan SDN Pulau Panggang 02 Pagi?
2. Apakah ikon kategori buku sudah membantu user memahami kategori secara visual?
3. Apakah halaman publik sudah cukup mudah digunakan siswa/orang tua?
4. Apakah halaman admin sudah cukup efisien untuk petugas perpustakaan?
5. Apakah integrasi FE-BE terlihat sungguhan dan konsisten?
6. Apa 5 perbaikan paling penting sebelum sidang/demo?
7. Apa 5 hal yang paling layak dibanggakan dalam presentasi?
8. Apa potensi pertanyaan dosen yang paling mungkin muncul dari sisi teknis?
9. Bagian mana yang masih terlihat belum production-ready?
10. Jika hanya punya waktu 1 hari, apa yang harus diperbaiki dulu?

