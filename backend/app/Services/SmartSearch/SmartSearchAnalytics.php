<?php

namespace App\Services\SmartSearch;

use App\Models\SearchLog;
use Illuminate\Support\Collection;

class SmartSearchAnalytics
{
    public function summary(): array
    {
        $logs = SearchLog::query()->latest()->get();
        $topKeywords = $this->topKeywords($logs);

        return [
            'total_searches' => $logs->count(),
            'avg_search_time' => round((float) $logs->avg('search_time_ms'), 2),
            'avg_result_count' => round((float) $logs->avg('result_count'), 2),
            'most_used_keyword' => $topKeywords[0]['keyword'] ?? null,
            'most_searched_keywords' => $topKeywords,
            'top_keywords' => $topKeywords,
            'searches_this_month' => SearchLog::whereBetween('created_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
            'searches_this_week' => SearchLog::whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
        ];
    }

    public function topKeywords(?Collection $logs = null, int $limit = 10): array
    {
        $logs ??= SearchLog::query()->get();

        return $logs
            ->flatMap(fn (SearchLog $log) => $log->tokens ?? [])
            ->filter()
            ->countBy()
            ->sortDesc()
            ->take($limit)
            ->map(fn (int $count, string $keyword) => [
                'keyword' => $keyword,
                'count' => $count,
            ])
            ->values()
            ->all();
    }
}
