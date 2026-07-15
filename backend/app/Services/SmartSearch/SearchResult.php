<?php

namespace App\Services\SmartSearch;

use Illuminate\Support\Collection;

class SearchResult
{
    public function __construct(
        public readonly Collection $books,
        public readonly array $tokens,
        public readonly int $resultCount,
        public readonly int $searchTimeMs,
    ) {
    }
}
