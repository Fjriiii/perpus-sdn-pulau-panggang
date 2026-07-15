<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SearchLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'query',
        'tokens',
        'result_count',
        'search_time_ms',
        'created_at',
    ];

    protected $casts = [
        'tokens' => 'array',
        'result_count' => 'integer',
        'search_time_ms' => 'integer',
        'created_at' => 'datetime',
    ];
}
