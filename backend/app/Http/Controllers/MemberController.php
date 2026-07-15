<?php

namespace App\Http\Controllers;

use App\Models\Member;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MemberController extends Controller
{
    public function index(Request $request)
    {
        $query = Member::withCount(['loans as active_loans_count' => fn ($q) => $q->where('status', 'active')]);

        if ($search = $request->get('q')) {
            $query->where(fn ($q) => $q
                ->where('name', 'like', "%{$search}%")
                ->orWhere('nisn', 'like', "%{$search}%"));
        }

        if ($kelas = $request->get('kelas')) {
            $query->where('kelas', $kelas);
        }

        return response()->json(['data' => $query->orderBy('name')->get()]);
    }

    public function checkByNisn(string $nisn)
    {
        $member = Member::with(['loans.book'])->where('nisn', $nisn)->first();
        $pending = Reservation::with('book')->where('nisn', $nisn)->where('status', 'pending')->get();

        if (! $member && $pending->isEmpty()) {
            return response()->json(['message' => 'NISN belum memiliki data peminjaman', 'loans' => [], 'reservations' => []], 404);
        }

        return response()->json([
            'member' => $member,
            'loans' => $member?->loans ?? [],
            'reservations' => $pending,
        ]);
    }

    public function store(Request $request)
    {
        $member = Member::create($this->validatedData($request));

        return response()->json(['message' => 'Anggota berhasil ditambahkan', 'data' => $member], 201);
    }

    public function show(Member $member)
    {
        return response()->json(['data' => $member->load('loans.book')]);
    }

    public function update(Request $request, Member $member)
    {
        $member->update($this->validatedData($request, $member->id));

        return response()->json(['message' => 'Anggota berhasil diperbarui', 'data' => $member->fresh()]);
    }

    public function destroy(Member $member)
    {
        $member->delete();

        return response()->json(['message' => 'Anggota berhasil dihapus']);
    }

    private function validatedData(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'nisn' => ['required', 'string', 'max:20', Rule::unique('members', 'nisn')->ignore($ignoreId)],
            'kelas' => ['required', 'string', 'max:10'],
            'parent_wa' => ['nullable', 'string', 'max:20'],
        ]);
    }
}
