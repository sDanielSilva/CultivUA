<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NotificationController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();
        Log::info('Verifying user token', ['user' => $user]);
    
        if (!$user) {
            Log::error('Failed authentication: Token is invalid or user not found');
            return response()->json(['error' => 'Não autorizado'], 401);
        }
    
        $notifications = Notification::where('admin', false)
            ->where('users_id', $user->id)
            ->get();
    
        return response()->json($notifications);
    }    

    public function adminIndex(Request $request)
    {
        $admin = $request->user(); // Usa o guard explicitamente.
        Log::info('Accessing admin notifications', ['admin' => $admin]);
    
        if ($admin) {
            $notifications = Notification::where('admin', true)->get();
            return response()->json($notifications);
        } else {
            Log::error('Unauthorized access to admin notifications');
            return response()->json(['error' => 'Não autorizado'], 401);
        }
    }    

    public function getNotifications($userId)
    {
        $notifications = Notification::where('users_id', $userId)
            ->where('admin', 0)
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        $unreadCount = Notification::where('users_id', $userId)
            ->where('admin', 0)
            ->where('is_read', 0)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $unreadCount,
        ]);
    }

    public function markAsRead($id)
    {
        $notification = Notification::find($id);

        if ($notification) {
            $notification->is_read = 1;
            $notification->save();
        }

        return response()->json(['success' => true]);
    }
}
