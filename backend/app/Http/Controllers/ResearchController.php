<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\SearchLog;
use App\Services\SmartSearch\SmartSearchAnalytics;
use App\Services\SmartSearch\TokenizationBasedSearchEngine;

class ResearchController extends Controller
{
    public function searchReport(SmartSearchAnalytics $analytics, TokenizationBasedSearchEngine $engine)
    {
        $sampleQuery = 'reptil sains';
        $sample = $engine->search($sampleQuery, shouldLog: false);

        return response()->json([
            'research_title' => 'Implementation of Smart Search using Keyword Tokenization on a Web-Based Library System',
            'current_phase' => 'Phase 1 - Keyword Tokenization Search',
            'future_phase' => 'Phase 2 - Semantic Search using Embedding / NLP',
            'total_books' => Book::count(),
            'total_searches' => SearchLog::count(),
            'avg_search_time' => round((float) SearchLog::avg('search_time_ms'), 2),
            'top_keywords' => $analytics->topKeywords(limit: 10),
            'search_accuracy_sample' => [
                'query' => $sampleQuery,
                'tokens' => $sample->tokens,
                'result_count' => $sample->resultCount,
                'top_results' => $sample->books->take(5)->map(fn (Book $book) => [
                    'title' => $book->title,
                    'relevance_score' => $book->relevance_score,
                    'matched_tokens' => $book->matched_tokens,
                ])->values(),
            ],
        ]);
    }
}
