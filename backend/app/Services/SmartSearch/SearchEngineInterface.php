<?php

namespace App\Services\SmartSearch;

use Illuminate\Support\Collection;

interface SearchEngineInterface
{
    public function search(?string $query, ?string $category = null, bool $shouldLog = true): SearchResult;

    public function tokenize(?string $query): array;

    public function score(Collection $books, array $tokens): Collection;
}
