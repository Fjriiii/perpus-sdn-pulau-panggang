<?php

namespace App\Services\SmartSearch;

use App\Models\Book;
use App\Models\SearchLog;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class TokenizationBasedSearchEngine implements SearchEngineInterface
{
    /**
     * Fase 1 PI: pencarian memakai keyword tokenization.
     * Fase 2 skripsi nanti dapat mengganti class ini dengan semantic search berbasis embedding/NLP
     * tanpa mengubah controller, karena kontraknya mengikuti SearchEngineInterface.
     */
    public function search(?string $query, ?string $category = null, bool $shouldLog = true): SearchResult
    {
        $startedAt = microtime(true);
        $tokens = $this->tokenize($query);

        $bookQuery = Book::query();

        if ($category) {
            $bookQuery->where('category', $category);
        }

        if ($tokens !== []) {
            $bookQuery->where(function ($q) use ($tokens) {
                foreach ($tokens as $token) {
                    // Proses matching: setiap token dicocokkan ke judul, pengarang, kategori, dan penerbit.
                    $q->orWhere(function ($sub) use ($token) {
                        $sub->whereRaw('LOWER(title) LIKE ?', ["%{$token}%"])
                            ->orWhereRaw('LOWER(author) LIKE ?', ["%{$token}%"])
                            ->orWhereRaw('LOWER(category) LIKE ?', ["%{$token}%"])
                            ->orWhereRaw('LOWER(publisher) LIKE ?', ["%{$token}%"]);
                    });
                }
            });
        }

        $books = $this->score($bookQuery->latest()->get(), $tokens);
        $searchTimeMs = (int) round((microtime(true) - $startedAt) * 1000);

        if ($shouldLog && filled($query)) {
            SearchLog::create([
                'query' => trim((string) $query),
                'tokens' => $tokens,
                'result_count' => $books->count(),
                'search_time_ms' => $searchTimeMs,
                'created_at' => now(),
            ]);
        }

        return new SearchResult(
            books: $books,
            tokens: $tokens,
            resultCount: $books->count(),
            searchTimeMs: $searchTimeMs,
        );
    }

    public function tokenize(?string $query): array
    {
        if (! filled($query)) {
            return [];
        }

        // Proses tokenisasi: query diubah ke huruf kecil, dipotong berdasarkan spasi,
        // lalu token kosong dibuang agar sistem bisa memproses multi-keyword seperti "reptil sains".
        return Str::of($query)
            ->lower()
            ->squish()
            ->explode(' ')
            ->filter(fn (string $token) => Str::length($token) > 1)
            ->unique()
            ->values()
            ->all();
    }

    public function score(Collection $books, array $tokens): Collection
    {
        return $books
            ->map(function (Book $book) use ($tokens) {
                $searchable = Str::of("{$book->title} {$book->author} {$book->category} {$book->publisher}")->lower()->toString();

                // Proses relevance scoring: setiap token yang ditemukan menambah skor 1.
                // Matched tokens disimpan agar penguji bisa melihat alasan buku muncul pada hasil.
                $matchedTokens = collect($tokens)
                    ->filter(fn (string $token) => str_contains($searchable, $token))
                    ->values()
                    ->all();

                $book->available_qty = $book->total_qty - $book->borrowed_qty;
                $book->is_available = $book->available_qty > 0;
                $book->relevance_score = count($matchedTokens);
                $book->matched_tokens = $matchedTokens;

                return $book;
            })
            // Proses ranking: hasil dengan relevance_score tertinggi ditampilkan lebih dahulu.
            ->sortByDesc(fn (Book $book) => $book->relevance_score)
            ->values();
    }
}
