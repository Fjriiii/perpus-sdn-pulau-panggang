<?php

namespace App\Http\Controllers;

use App\Services\SmartSearch\SmartSearchAnalytics;

class SmartSearchAnalyticsController extends Controller
{
    public function index(SmartSearchAnalytics $analytics)
    {
        return response()->json($analytics->summary());
    }
}
