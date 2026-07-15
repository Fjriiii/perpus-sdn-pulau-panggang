<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Loan;
use App\Models\Member;
use App\Models\Reservation;
use App\Models\SearchLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $books = Book::query()->orderBy('id')->take(12)->get();

        if ($books->count() < 6) {
            $this->command?->warn('Demo data skipped: not enough books available.');
            return;
        }

        Schema::disableForeignKeyConstraints();
        Loan::truncate();
        Reservation::truncate();
        Member::truncate();
        SearchLog::truncate();
        Schema::enableForeignKeyConstraints();

        Book::query()->update(['borrowed_qty' => 0]);

        $members = collect([
            ['name' => 'Aisyah Putri', 'nisn' => '1001001001', 'kelas' => '4A', 'parent_wa' => '6281211110001'],
            ['name' => 'Rafi Maulana', 'nisn' => '1001001002', 'kelas' => '5B', 'parent_wa' => '6281211110002'],
            ['name' => 'Nadia Rahma', 'nisn' => '1001001003', 'kelas' => '3A', 'parent_wa' => '6281211110003'],
            ['name' => 'Dimas Pratama', 'nisn' => '1001001004', 'kelas' => '6A', 'parent_wa' => '6281211110004'],
            ['name' => 'Salsa Kirana', 'nisn' => '1001001005', 'kelas' => '2B', 'parent_wa' => '6281211110005'],
        ])->map(fn (array $member) => Member::create($member));

        $loanRows = [
            [$members[0], $books[0], now()->subDays(2), now()->addDays(5), 'active'],
            [$members[1], $books[1], now()->subDays(4), now()->addDays(3), 'active'],
            [$members[2], $books[2], now()->subDays(12), now()->subDays(5), 'overdue'],
            [$members[3], $books[3], now()->subDays(9), now()->subDays(2), 'overdue'],
            [$members[4], $books[4], now()->subDays(14), now()->subDays(7), 'returned'],
        ];

        foreach ($loanRows as [$member, $book, $loanDate, $dueDate, $status]) {
            Loan::create([
                'member_id' => $member->id,
                'book_id' => $book->id,
                'loan_date' => $loanDate->toDateString(),
                'return_due_date' => $dueDate->toDateString(),
                'actual_return_date' => $status === 'returned' ? now()->subDays(6)->toDateString() : null,
                'status' => $status,
            ]);

            if ($status !== 'returned') {
                $book->increment('borrowed_qty');
            }
        }

        Reservation::create([
            'student_name' => 'Fathan Rizky',
            'nisn' => '1001001006',
            'kelas' => '4B',
            'parent_wa' => '6281211110006',
            'book_id' => $books[5]->id,
            'loan_date' => now()->toDateString(),
            'return_due_date' => now()->addDays(7)->toDateString(),
            'status' => 'pending',
        ]);

        Reservation::create([
            'student_name' => 'Laras Safitri',
            'nisn' => '1001001007',
            'kelas' => '5A',
            'parent_wa' => '6281211110007',
            'book_id' => $books[6]->id,
            'loan_date' => now()->subDay()->toDateString(),
            'return_due_date' => now()->addDays(6)->toDateString(),
            'status' => 'rejected',
        ]);

        $logs = [
            ['query' => 'sains reptil', 'tokens' => ['sains', 'reptil'], 'result_count' => 34, 'search_time_ms' => 142],
            ['query' => 'matematika', 'tokens' => ['matematika'], 'result_count' => 12, 'search_time_ms' => 86],
            ['query' => 'cerita rakyat', 'tokens' => ['cerita', 'rakyat'], 'result_count' => 9, 'search_time_ms' => 96],
            ['query' => 'agama islam', 'tokens' => ['agama', 'islam'], 'result_count' => 7, 'search_time_ms' => 105],
            ['query' => 'sejarah indonesia', 'tokens' => ['sejarah', 'indonesia'], 'result_count' => 11, 'search_time_ms' => 118],
        ];

        foreach ($logs as $index => $log) {
            SearchLog::create([
                ...$log,
                'created_at' => now()->subHours($index + 1),
            ]);
        }
    }
}
