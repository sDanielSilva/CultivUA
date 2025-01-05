<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Retornar todas as notificações
    public function getNotifications()
    {
        return Notification::all();
    }

    // Retornar todos os pedidos
    public function getOrders()
    {
        return Order::all();
    }
}
