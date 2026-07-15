# Implementation of Smart Search using Keyword Tokenization on a Web-Based Library System

Proyek PI Informatika dengan kontribusi utama pada Smart Search berbasis keyword tokenization.
Sistem perpustakaan SDN Pulau Panggang digunakan sebagai studi kasus implementasi.

- Backend: Laravel 11 REST API + Sanctum token auth
- Frontend: React + Vite + Tailwind CSS
- Data awal: `backend/database/seeders/data/books.csv`

## Research Positioning

Fokus penelitian:

> Implementation of Smart Search using Keyword Tokenization on a Web-Based Library System

Tujuan:

- Memproses query multi-keyword menjadi token.
- Mencocokkan token ke `title`, `author`, `category`, dan `publisher`.
- Menghitung `relevance_score`.
- Menampilkan buku dengan skor tertinggi lebih dahulu.
- Mencatat aktivitas pencarian sebagai dataset pendukung PI.

Contoh:

```json
{
  "query": "reptil sains",
  "tokens": ["reptil", "sains"],
  "top_result": {
    "title": "Jelajah Ilmu Pengetahuan Seri Reptil dan Amfibi Jilid 1",
    "relevance_score": 2,
    "matched_tokens": ["reptil", "sains"]
  }
}
```

## Database Schema

Tabel utama:

- `books`: `id`, `title`, `author`, `publisher`, `year`, `isbn`, `category`, `dewey_code`, `total_qty`, `borrowed_qty`, timestamps.
- `members`: `id`, `name`, `nisn` unique, `kelas`, `parent_wa`, timestamps.
- `loans`: `id`, `member_id` FK, `book_id` FK, `loan_date`, `return_due_date`, `actual_return_date`, `status`, timestamps.
- `reservations`: `id`, `student_name`, `nisn`, `kelas`, `parent_wa`, `book_id` FK, `loan_date`, `return_due_date`, `status`, timestamps.
- `admins`: `id`, `username` unique, `password`, timestamps.
- `search_logs`: `id`, `query`, `tokens`, `result_count`, `search_time_ms`, `created_at`.

## Seeder

`BookSeeder` membaca `database/seeders/data/books.csv` dan memetakan:

- `Judul Buku` atau `JUDUL BUKU` -> `title`
- `Pengarang` -> `author`
- `Penerbit` -> `publisher`
- `Tahun Terbit` -> `year`
- `ISBN` -> `isbn`
- `Jumlah Buku` atau `JUMLAH BUKU` -> `total_qty`
- `Kategori DDC` atau `KATEGORI` -> `category`
- `Kode DDC` atau `KODE BUKU` -> `dewey_code`

`AdminSeeder` membuat akun default `admin` / `admin123`.

## Backend API

Public:

```bash
GET    /api/books
GET    /api/books/recent
GET    /api/books/{book}
GET    /api/members/check/{nisn}
POST   /api/reservations
POST   /api/auth/login
GET    /api/research/search-report
```

Admin:

```bash
POST   /api/auth/logout
GET    /api/admin/stats
GET    /api/admin/search-stats
GET    /api/admin/reservations
POST   /api/admin/reservations/{id}/approve
POST   /api/admin/reservations/{reservation}/reject
GET    /api/admin/books
POST   /api/admin/books
GET    /api/admin/books/{book}
PUT    /api/admin/books/{book}
DELETE /api/admin/books/{book}
GET    /api/admin/members
POST   /api/admin/members
GET    /api/admin/members/{member}
PUT    /api/admin/members/{member}
DELETE /api/admin/members/{member}
GET    /api/admin/loans
POST   /api/admin/loans
POST   /api/admin/loans/{loan}/return
```

Smart Search tokenization ada di `backend/app/Http/Controllers/BookController.php`.
Tokenization-Based Search Engine ada di `backend/app/Services/SmartSearch/TokenizationBasedSearchEngine.php`.
Smart Search Analytics ada di `backend/app/Services/SmartSearch/SmartSearchAnalytics.php`.
Mock Fonnte WhatsApp Gateway ada di `backend/app/Http/Controllers/ReservationController.php`.

## Smart Search Architecture

Phase 1 saat ini:

- `SearchEngineInterface`
- `TokenizationBasedSearchEngine`
- `SearchResult`
- `SearchLog`
- `SmartSearchAnalytics`

Phase 2 untuk skripsi:

- Class engine baru dapat dibuat untuk Semantic Search using Embedding / NLP.
- Controller tidak perlu dirombak besar karena engine mengikuti kontrak interface.
- NLP belum diimplementasikan pada PI ini agar scope tetap sesuai.

## Frontend

Halaman publik:

- `/`: OPAC + smart search, keyword chips, grid buku, modal reservasi.
- `/koleksi`: 20 koleksi terbaru.
- `/tata-tertib`: aturan perpustakaan.
- `/cek-pinjaman`: cek status berdasarkan NISN.

Halaman admin:

- `/admin/login`: login token.
- `/admin`: dashboard statistik dan overdue.
- `/admin`: Smart Search Analytics, total searches, average time, most used keyword, average result count, dan chart top keyword.
- `/admin/requests`: approve/reject reservasi + WaLogModal.
- `/admin/books`: CRUD buku + pagination 15.
- `/admin/members`: CRUD anggota + pagination 10.
- `/admin/loans`: input peminjaman manual.
- `/admin/returns`: proses pengembalian.

Design system:

- Primary: `#1a5c3a`, `#2d7a52`, `#0f3d26`
- Accent: `#f5a623`, `#fdf3dc`
- Font: Plus Jakarta Sans + Fraunces

## Setup Commands

Backend:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate:fresh --seed
php artisan serve --host=127.0.0.1 --port=8000
```

Frontend:

```bash
cd frontend
npm install
npm install axios react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
echo "VITE_API_URL=http://localhost:8000/api" > .env
npm run dev -- --host 127.0.0.1 --port 5173
```

Jika port `5173` sedang dipakai:

```bash
npm run dev -- --host 127.0.0.1 --port 5174
```

## Checklist PI

- [x] OPAC cari buku berdasarkan judul, pengarang, kategori
- [x] Smart Search Tokenization multi-keyword
- [x] Keyword chips visual
- [x] Card buku dengan status tersedia/dipinjam
- [x] Halaman koleksi terbaru
- [x] Halaman tata tertib
- [x] Alur reservasi buku tanpa login
- [x] Cek status peminjaman by NISN
- [x] Login admin dengan token
- [x] Dashboard statistik 5 kartu
- [x] Tabel overdue dashboard
- [x] Manajemen permintaan pinjam
- [x] WhatsApp Gateway Log saat approve
- [x] CRUD data buku
- [x] CRUD data anggota
- [x] Form peminjaman manual
- [x] Proses pengembalian buku
- [x] CSV seeder buku
- [x] Admin seeder default
- [x] CORS dev frontend
