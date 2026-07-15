<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $admin = Admin::where('username', $credentials['username'])->first();

        if (! $admin || ! Hash::check($credentials['password'], $admin->password)) {
            return response()->json(['error' => 'Username atau password salah'], 401);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'username' => $admin->username,
        ]);
    }

    public function logout(Request $request)
    {
        $token = $request->bearerToken();

        if ($token && $accessToken = \Laravel\Sanctum\PersonalAccessToken::findToken($token)) {
            $accessToken->delete();
        }

        return response()->json(['message' => 'Logout berhasil']);
    }
}
