<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Services\SmartSearch\TokenizationBasedSearchEngine;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BookController extends Controller
{
    public function index(Request $request, TokenizationBasedSearchEngine $smartSearch)
    {
        $result = $smartSearch->search(
            query: $request->get('q'),
            category: $request->get('category'),
            shouldLog: ! $request->boolean('skip_log'),
        );

        return response()->json([
            'module_name' => 'Smart Search Module',
            'engine_name' => 'Tokenization-Based Search Engine',
            'data' => $result->books,
            'tokens' => $result->tokens,
            'total' => $result->resultCount,
            'search_time_ms' => $result->searchTimeMs,
        ]);
    }

    public function recent()
    {
        return response()->json([
            'data' => Book::latest()->limit(20)->get(),
        ]);
    }

    public function show(Book $book)
    {
        return response()->json(['data' => $book]);
    }

    public function store(Request $request)
    {
        $book = Book::create($this->validatedData($request));

        return response()->json(['message' => 'Buku berhasil ditambahkan', 'data' => $book], 201);
    }

    public function update(Request $request, Book $book)
    {
        $book->update($this->validatedData($request, true));

        return response()->json(['message' => 'Buku berhasil diperbarui', 'data' => $book->fresh()]);
    }

    public function destroy(Book $book)
    {
        $book->delete();

        return response()->json(['message' => 'Buku berhasil dihapus']);
    }

    private function validatedData(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'title' => [$required, 'string', 'max:255'],
            'author' => [$required, 'string', 'max:255'],
            'publisher' => [$required, 'string', 'max:255'],
            'year' => [$required, 'integer', 'min:1900', 'max:2100'],
            'isbn' => ['nullable', 'string', 'max:50'],
            'category' => [$required, 'string', 'max:100'],
            'dewey_code' => ['nullable', 'string', 'max:10'],
            'total_qty' => [$required, 'integer', 'min:0'],
            'borrowed_qty' => ['sometimes', 'integer', 'min:0', Rule::when($request->filled('total_qty'), ['lte:total_qty'])],
        ]);
    }
}
