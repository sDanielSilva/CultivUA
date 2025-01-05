<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckActiveMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Verifica se o userestá autenticado via Sanctum e se está ativo
        if (Auth::guard('sanctum')->check() && !Auth::user()->is_active) {
            Auth::guard('sanctum')->logout();
            return response()->json(['message' => 'Esta conta não está ativa.'], 403);
        }

        return $next($request);
    }
}
