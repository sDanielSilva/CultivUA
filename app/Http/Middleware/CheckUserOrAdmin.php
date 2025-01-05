<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckUserOrAdmin
{
    public function handle(Request $request, Closure $next)
    {
        if (auth('admin')->check() || auth('web')->check()) {
            return $next($request);
        }

        return response()->json(['error' => 'Não autorizado'], 403);
    }
}
