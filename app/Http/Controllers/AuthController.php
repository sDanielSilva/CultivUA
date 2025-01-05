<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Login via API (com Sanctum)
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('CultivUA', ['user'])->plainTextToken;

            return response()->json([
                'id' => $user->id,
                'token' => $token,
                'email' => $user->email,
                'user_type' => 'user', // Adiciona o tipo de utilizador
            ]);
        }

        return response()->json(['error' => 'Unauthorized'], 401);
    }

    // Logout via API
    public function logout(Request $request)
    {
        Auth::user()->tokens->each(function ($token) {
            $token->delete();  // Apaga cada token individualmente
        });

        return response()->json(['message' => 'Logout realizado com sucesso'], 200);
    }


    // Registo via API
    public function register(Request $request)
    {
        $validated = $request->validate([
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $token = $user->createToken('CultivUA')->plainTextToken;

        return response()->json([
            'message' => 'Utilizador registado com sucesso!',
            'token' => $token,
        ], 201);
    }
}
