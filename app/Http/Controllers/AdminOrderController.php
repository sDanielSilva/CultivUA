<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Category;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Models\StockProduct;
use App\Models\User;
use App\Models\SupportTicket;
use App\Models\UserPlant;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Log;

class AdminOrderController extends Controller
{
    public function index()
    {
        $categories = Category::all()->map(function ($category) {
            $numberOfProducts = StockProduct::where('categories_id', $category->id)->count();
            return [
                'id' => $category->id,
                'name' => $category->name,
                'mostrarLoja' => $category->mostrarLoja,
                'mostrarBlog' => $category->mostrarBlog,
                'number' => $numberOfProducts,
            ];
        });

        return response()->json($categories);
    }

    public function storeCategory(Request $request)
    {
        // Validação inicial dos dados recebidos
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Verifica se a categoria já existe
        $existingCategory = Category::where('name', $validated['name'])->first();

        if ($existingCategory) {
            // Retorna uma mensagem se a categoria já existir
            return response()->json([
                'message' => 'A categoria já existe!',
                'category' => $existingCategory,
            ], 409); // Código HTTP 409: Conflito
        }

        // Cria a nova categoria
        $category = Category::create(['name' => $validated['name']]);

        // Retorna uma resposta de sucesso
        return response()->json([
            'message' => 'Categoria adicionada com sucesso!',
            'category' => $category,
        ], 201); // Código HTTP 201: Criado
    }



    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['error' => 'Categoria não encontrada'], 404);
        }

        return response()->json($category, 200);
    }

    public function update(Request $request, $id)
    {
        \Log::info('Payload recebido no update:', $request->all());

        $category = Category::findOrFail($id);

        $category->update([
            'name' => $request->input('name'),
            'mostrarLoja' => $request->input('mostrarLoja'),
            'mostrarBlog' => $request->input('mostrarBlog'),
        ]);

        return response()->json(['message' => 'Categoria atualizada com sucesso!'], 200);
    }

    public function destroy($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Categoria não encontrada!'], 404);
        }

        $category->delete();
        return response()->json(['message' => 'Categoria apagarda com sucesso!']);
    }

    public function getDashboardStats()
    {
        $totalUsers = User::count();
        $totalProductsSold = OrderItem::sum('quantity');
        $totalSales = Order::sum('total_amount');
        $totalActiveGardens = UserPlant::distinct('users_id')->count('users_id');
        $totalProducts = StockProduct::count();
        $totalQuestionsAnswered = SupportTicket::where('status', 'closed')->count();

        return response()->json([ 
            'message' => 'Estatísticas do Dashboard',
            'totalUsers' => $totalUsers,
            'totalProductsSold' => $totalProductsSold,
            'totalSales' => $totalSales,
            'totalActiveGardens' => $totalActiveGardens,
            'totalProducts' => $totalProducts,
            'totalQuestionsAnswered' => $totalQuestionsAnswered,
        ]);

        
    }
    public function getProductsSoldByCategory()
    {
        $salesByCategory = DB::table('categories')
        ->join('stock_products', 'categories.id', '=', 'stock_products.categories_id')
        ->join('order_items', 'stock_products.id', '=', 'order_items.stock_products_id')
        ->select('categories.name as category', DB::raw('SUM(order_items.quantity) as total_sold'))
        ->groupBy('categories.id', 'categories.name')
        ->orderBy('total_sold', 'desc')
        ->get();

    return response()->json($salesByCategory);
    }
    

    public function getMonthlySales(Request $request)
    {
        $sales = Order::selectRaw('MONTH(created_at) as month, DAY(created_at) as day, SUM(total_amount) as total_sales')
        ->whereYear('created_at', now()->year)
        ->groupBy('month', 'day')
        ->orderBy('month')
        ->orderBy('day')
        ->get()
        ->groupBy('month');

        return response()->json($sales);
    }

    public function getPlantDataByDay()
    {
    // Consulta para obter o número de plantas por dia com valores acumulativos
    $data = DB::table('users_plants')
    ->select(
        DB::raw('DATE(created_at) as day'),
        DB::raw('COUNT(*) as daily_total'), // Total diário
        DB::raw('SUM(COUNT(*)) OVER (ORDER BY DATE(created_at)) as cumulative_total') // Soma acumulativa
    )
    ->groupBy('day')
    ->orderBy('day', 'ASC')
    ->get();

    return response()->json($data);

    }

     public function indexTicket()
     {
         $tickets = SupportTicket::all();
         return response()->json($tickets, 200);
     }

     public function updateTicket(Request $request, $id)
     {
         $ticket = SupportTicket::find($id);
 
         if (!$ticket) {
             return response()->json(['message' => 'Ticket não encontrado'], 404);
         }
 
         $request->validate([
             'response' => 'nullable|string',
             'status' => 'required|string|in:open,closed',
         ]);
 
         $ticket->update($request->all());
         return response()->json($ticket, 200);
     }
 
     public function destroyTicket($id)
     {
         $ticket = SupportTicket::find($id);
 
         if (!$ticket) {
             return response()->json(['message' => 'Ticket não encontrado'], 404);
         }
 
         $ticket->delete();
         return response()->json(['message' => 'Ticket iliminado com sucesso'], 200);
     }
}
