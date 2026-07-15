<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Loan;
use App\Models\Reservation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

class BookSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/books.csv');

        if (! file_exists($path)) {
            $this->command?->error("CSV tidak ditemukan: {$path}");
            return;
        }

        Schema::disableForeignKeyConstraints();
        Reservation::truncate();
        Loan::truncate();
        Book::truncate();
        Schema::enableForeignKeyConstraints();

        $handle = fopen($path, 'r');
        $headers = fgetcsv($handle);

        if ($headers === false) {
            fclose($handle);
            return;
        }

        $headers = array_map(fn ($header) => $this->normalizeHeader($header), $headers);
        $count = 0;

        while (($row = fgetcsv($handle)) !== false) {
            $record = array_combine($headers, array_pad($row, count($headers), null));

            if (! $record || blank($this->field($record, ['judul_buku']))) {
                continue;
            }

            Book::create([
                'title' => $this->field($record, ['judul_buku']),
                'author' => $this->field($record, ['pengarang'], 'Tidak diketahui'),
                'publisher' => $this->field($record, ['penerbit'], 'Tidak diketahui'),
                'year' => (int) $this->field($record, ['tahun_terbit'], now()->year),
                'isbn' => $this->nullableDash($this->field($record, ['isbn'])),
                'total_qty' => max(1, (int) $this->field($record, ['jumlah_buku'], 1)),
                'borrowed_qty' => 0,
                'category' => $this->field($record, ['kategori_ddc', 'kategori'], 'Karya Umum'),
                'dewey_code' => $this->nullableDash($this->field($record, ['kode_ddc', 'kode_buku'])),
            ]);

            $count++;
        }

        fclose($handle);
        $this->command?->info("Imported {$count} books.");
    }

    private function normalizeHeader(?string $header): string
    {
        return Str::of($header ?? '')
            ->trim()
            ->lower()
            ->replaceMatches('/[^a-z0-9]+/', '_')
            ->trim('_')
            ->toString();
    }

    private function field(array $record, array $keys, mixed $default = null): mixed
    {
        foreach ($keys as $key) {
            if (array_key_exists($key, $record) && filled($record[$key])) {
                return trim((string) $record[$key]);
            }
        }

        return $default;
    }

    private function nullableDash(mixed $value): ?string
    {
        $value = trim((string) $value);

        return $value === '' || $value === '-' ? null : $value;
    }
}
