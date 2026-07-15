<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoanController extends Controller
{
    public function index()
    {
        $this->syncOverdueStatus();

        return response()->json([
            'data' => Loan::with(['member', 'book'])->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'member_id' => ['required', 'exists:members,id'],
            'book_id' => ['required', 'exists:books,id'],
            'loan_date' => ['nullable', 'date'],
            'return_due_date' => ['nullable', 'date', 'after_or_equal:loan_date'],
        ]);

        $loanDate = Carbon::parse($data['loan_date'] ?? today())->toDateString();
        $returnDueDate = isset($data['return_due_date'])
            ? Carbon::parse($data['return_due_date'])->toDateString()
            : Carbon::parse($loanDate)->addDays(7)->toDateString();

        return DB::transaction(function () use ($data, $loanDate, $returnDueDate) {
            $book = Book::lockForUpdate()->findOrFail($data['book_id']);

            if ($book->available_qty <= 0) {
                return response()->json(['error' => 'Stok buku habis'], 422);
            }

            $loan = Loan::create([
                'member_id' => $data['member_id'],
                'book_id' => $book->id,
                'loan_date' => $loanDate,
                'return_due_date' => $returnDueDate,
                'status' => 'active',
            ]);

            $book->increment('borrowed_qty');

            return response()->json(['message' => 'Peminjaman berhasil dicatat', 'data' => $loan->load(['member', 'book'])], 201);
        });
    }

    public function processReturn(Loan $loan)
    {
        if ($loan->status === 'returned') {
            return response()->json(['error' => 'Buku sudah dikembalikan'], 422);
        }

        DB::transaction(function () use ($loan) {
            $loan->update([
                'actual_return_date' => today()->toDateString(),
                'status' => 'returned',
            ]);

            $loan->book()->decrement('borrowed_qty');
        });

        return response()->json(['message' => 'Pengembalian berhasil diproses', 'data' => $loan->fresh(['member', 'book'])]);
    }

    private function syncOverdueStatus(): void
    {
        Loan::where('status', 'active')
            ->whereDate('return_due_date', '<', today())
            ->update(['status' => 'overdue']);
    }
}
