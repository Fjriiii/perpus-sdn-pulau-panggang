<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Loan;
use App\Models\Member;
use App\Models\Reservation;
use App\Services\SmartSearch\SmartSearchAnalytics;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(SmartSearchAnalytics $smartSearchAnalytics)
    {
        Loan::where('status', 'active')
            ->whereDate('return_due_date', '<', today())
            ->update(['status' => 'overdue']);

        $overdueLoans = Loan::with(['member', 'book'])
            ->where('status', 'overdue')
            ->orderBy('return_due_date')
            ->get()
            ->map(function (Loan $loan) {
                $loan->days_late = Carbon::parse($loan->return_due_date)->diffInDays(today());

                return $loan;
            });

        return response()->json([
            'stats' => [
                'total_books' => Book::sum('total_qty'),
                'active_members' => Member::count(),
                'borrowed_books' => Loan::whereIn('status', ['active', 'overdue'])->count(),
                'overdue_loans' => $overdueLoans->count(),
                'pending_reservations' => Reservation::where('status', 'pending')->count(),
            ],
            'overdue_loans' => $overdueLoans,
            'smart_search_analytics' => $smartSearchAnalytics->summary(),
        ]);
    }
}
