<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use App\Models\Member;
use App\Models\Reservation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReservationController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Reservation::with('book')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'student_name' => ['required', 'string', 'max:255'],
            'nisn' => ['required', 'string', 'max:20'],
            'kelas' => ['required', 'string', 'max:10'],
            'parent_wa' => ['required', 'string', 'max:20'],
            'book_id' => ['required', 'exists:books,id'],
            'loan_date' => ['nullable', 'date'],
            'return_due_date' => ['nullable', 'date', 'after_or_equal:loan_date'],
        ]);

        $loanDate = Carbon::parse($data['loan_date'] ?? today())->toDateString();

        $reservation = Reservation::create([
            ...$data,
            'loan_date' => $loanDate,
            'return_due_date' => isset($data['return_due_date'])
                ? Carbon::parse($data['return_due_date'])->toDateString()
                : Carbon::parse($loanDate)->addDays(7)->toDateString(),
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Permintaan peminjaman berhasil dikirim',
            'data' => $reservation->load('book'),
        ], 201);
    }

    public function approve(int $id)
    {
        return DB::transaction(function () use ($id) {
            $reservation = Reservation::lockForUpdate()->findOrFail($id);

            if ($reservation->status !== 'pending') {
                return response()->json(['error' => 'Reservasi sudah diproses'], 422);
            }

            $book = Book::lockForUpdate()->findOrFail($reservation->book_id);

            if ($book->available_qty <= 0) {
                return response()->json(['error' => 'Stok buku habis'], 422);
            }

            $member = Member::firstOrCreate(
                ['nisn' => $reservation->nisn],
                [
                    'name' => $reservation->student_name,
                    'kelas' => $reservation->kelas,
                    'parent_wa' => $reservation->parent_wa,
                ]
            );

            $loan = Loan::create([
                'member_id' => $member->id,
                'book_id' => $reservation->book_id,
                'loan_date' => $reservation->loan_date,
                'return_due_date' => $reservation->return_due_date,
                'status' => 'active',
            ]);

            $book->increment('borrowed_qty');
            $reservation->update(['status' => 'approved']);

            $waResult = $this->sendWhatsAppNotification(
                $reservation->parent_wa,
                $reservation->student_name,
                $book->title,
                $reservation->return_due_date->format('Y-m-d')
            );

            return response()->json([
                'message' => 'Reservasi disetujui',
                'loan' => $loan->load(['member', 'book']),
                'reservation' => $reservation->fresh('book'),
                'wa_log' => $waResult,
            ]);
        });
    }

    public function reject(Reservation $reservation)
    {
        if ($reservation->status !== 'pending') {
            return response()->json(['error' => 'Reservasi sudah diproses'], 422);
        }

        $reservation->update(['status' => 'rejected']);

        return response()->json(['message' => 'Reservasi ditolak', 'data' => $reservation->fresh('book')]);
    }

    private function sendWhatsAppNotification($phone, $studentName, $bookTitle, $returnDate): array
    {
        $message = "Halo Orang Tua dari {$studentName},\n"
            . "buku \"{$bookTitle}\" berhasil dipinjam dan harus dikembalikan sebelum {$returnDate}.\n\n"
            . "Terima kasih,\nPerpustakaan SDN Pulau Panggang";

        $payload = [
            'target' => $phone,
            'message' => $message,
        ];

        // Production: gunakan token Fonnte aktif jika proyek sudah siap kirim pesan nyata.
        // $response = Http::withHeaders([
        //     'Authorization' => env('FONNTE_TOKEN'),
        // ])->post('https://api.fonnte.com/send', $payload);
        // return $response->json();

        return [
            'mock' => true,
            'endpoint' => 'https://api.fonnte.com/send',
            'payload' => $payload,
            'response' => [
                'status' => true,
                'message_id' => 'MSG-' . time(),
                'reason' => 'success (simulated)',
            ],
        ];
    }
}
