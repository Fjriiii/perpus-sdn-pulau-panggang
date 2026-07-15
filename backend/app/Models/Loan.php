<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Loan extends Model
{
    protected $fillable = [
        'member_id',
        'book_id',
        'loan_date',
        'return_due_date',
        'actual_return_date',
        'status',
    ];

    protected $casts = [
        'loan_date' => 'date:Y-m-d',
        'return_due_date' => 'date:Y-m-d',
        'actual_return_date' => 'date:Y-m-d',
    ];

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
