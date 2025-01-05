<?php

namespace App\Http\Controllers;
use App\Models\OrderItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index()
    {
        // Retornar pedidos do user autenticado
        $orders = Auth::user()->orders;
        return response()->json($orders);
    }

    public function show(Order $order)
    {
        return response()->json($order);
    }

    public function complete(Order $order)
    {
        $order->update(['status' => 'completed']);
        return response()->json(['message' => 'Pedido completado com sucesso.']);
    }


    public function store(Request $request)
    {
        // Validar os dados recebidos
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'cartItems' => 'required|array',
            'totalAmount' => 'required|numeric',
            'totalQuantity' => 'required|numeric',
        ]);

        // Criar um novo pedido
        $order = Order::create([
            'users_id' => $validated['user_id'],
            'total_amount' => $validated['totalAmount'],
            'status' => 'pending',  // Pode ser alterado conforme o fluxo
        ]);

        // Inserir os itens do pedido
        foreach ($validated['cartItems'] as $item) {
            OrderItem::create([
                'quantity' => $item['quantity'],
                'stock_products_id' => $item['id'],  // O ID do produto no estoque
                'orders_id' => $order->id,  // ID do pedido que acabou de ser criado
            ]);
        }

        // Retornar o ID do pedido na resposta
        return response()->json([
            'message' => 'Order created successfully!',
            'order_id' => $order->id  // Retornando o ID do pedido criado
        ], 201);
    }



    public function updateOrderStatus(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'status' => 'required|in:pending,completed,cancelled', // Apenas status válidos
        ]);

        // Com o 'order_id' do corpo da requisição
        $order = Order::findOrFail($data['order_id']);
        $order->status = $data['status'];
        $order->save();

        return response()->json(['message' => 'Order status updated successfully!']);
    }

    public function getPurchaseHistory($userId)
    {
        Log::info('User ID recebido:', ['id' => $userId]);

        $orders = Order::where('users_id', $userId)
            ->where('status', 'completed')
            ->orderBy('created_at', 'desc')
            ->with(['orderItems.stockProduct:id,name']) // Carregar os produtos associados
            ->get(['id', 'total_amount', 'created_at']);

        Log::info('Orders encontrados:', $orders->toArray());

        $orders->each(function ($order) {
            $order->products_summary = $order->orderItems->map(function ($item) {
                return "{$item->quantity}x {$item->stockProduct->name}";
            })->join('; ');
        });

        return response()->json($orders);
    }

}
