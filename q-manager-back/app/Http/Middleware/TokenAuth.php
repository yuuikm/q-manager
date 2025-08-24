<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\PersonalAccessToken;

class TokenAuth
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Find the token in the database
        $personalAccessToken = PersonalAccessToken::where('token', hash('sha256', $token))->first();

        if (!$personalAccessToken) {
            return response()->json(['message' => 'Invalid token'], 401);
        }

        // Check if token is expired
        if ($personalAccessToken->expires_at && $personalAccessToken->expires_at->isPast()) {
            $personalAccessToken->delete();
            return response()->json(['message' => 'Token expired'], 401);
        }

        // Update last used timestamp
        $personalAccessToken->update(['last_used_at' => now()]);

        // Set the user for the request
        $user = $personalAccessToken->tokenable;
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        return $next($request);
    }
}
