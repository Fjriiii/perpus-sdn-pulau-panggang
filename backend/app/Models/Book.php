<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Book extends Model
{
    protected $fillable = [
        'title',
        'author',
        'publisher',
        'year',
        'isbn',
        'category',
        'dewey_code',
        'total_qty',
        'borrowed_qty',
    ];

    protected $appends = [
        'available_qty',
        'is_available',
    ];

    protected $casts = [
        'year' => 'integer',
        'total_qty' => 'integer',
        'borrowed_qty' => 'integer',
    ];

    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function getAvailableQtyAttribute(): int
    {
        return max(0, (int) $this->total_qty - (int) $this->borrowed_qty);
    }

    public function getIsAvailableAttribute(): bool
    {
        return $this->available_qty > 0;
    }
}
