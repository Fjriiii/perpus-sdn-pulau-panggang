<?php

namespace App\Http\Middleware;

use App\Models\Admin;
use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class AdminAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json(['error' => 'Token admin dibutuhkan'], 401);
        }

        $accessToken = PersonalAccessToken::findToken($token);

        if (! $accessToken || ! $accessToken->tokenable instanceof Admin) {
            return response()->json(['error' => 'Token admin tidak valid'], 401);
        }

        $admin = $accessToken->tokenable;
        $request->setUserResolver(fn () => $admin);
        $accessToken->forceFill(['last_used_at' => now()])->save();

        return $next($request);
    }
}
