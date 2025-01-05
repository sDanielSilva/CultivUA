<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Verifica se o user está autenticado via Sanctum e se é admin
        if (Auth::guard('sanctum')->check() && Auth::user()->is_admin) {
            return $next($request);
        }

        return response()->json(['message' => 'Sem permissão para aceder esta área.'], 403);
    }
}
