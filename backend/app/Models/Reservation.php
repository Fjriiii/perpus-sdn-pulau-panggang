<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    protected $fillable = [
        'student_name',
        'nisn',
        'kelas',
        'parent_wa',
        'book_id',
        'loan_date',
        'return_due_date',
        'status',
    ];

    protected $casts = [
        'loan_date' => 'date:Y-m-d',
        'return_due_date' => 'date:Y-m-d',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class);
    }
}
