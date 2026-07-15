<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ResearchController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\SmartSearchAnalyticsController;
use App\Http\Middleware\AdminAuth;
use Illuminate\Support\Facades\Route;

Route::get('/books/recent', [BookController::class, 'recent']);
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/members/check/{nisn}', [MemberController::class, 'checkByNisn']);
Route::post('/reservations', [ReservationController::class, 'store']);
Route::get('/research/search-report', [ResearchController::class, 'searchReport']);

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware(AdminAuth::class);

Route::middleware(AdminAuth::class)->prefix('admin')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/stats', [DashboardController::class, 'stats']);
    Route::get('/search-stats', [SmartSearchAnalyticsController::class, 'index']);

    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations/{id}/approve', [ReservationController::class, 'approve']);
    Route::post('/reservations/{reservation}/reject', [ReservationController::class, 'reject']);

    Route::apiResource('/books', BookController::class)->except(['index', 'show']);
    Route::get('/books', [BookController::class, 'index']);
    Route::get('/books/{book}', [BookController::class, 'show']);

    Route::apiResource('/members', MemberController::class);

    Route::get('/loans', [LoanController::class, 'index']);
    Route::post('/loans', [LoanController::class, 'store']);
    Route::post('/loans/{loan}/return', [LoanController::class, 'processReturn']);
});
