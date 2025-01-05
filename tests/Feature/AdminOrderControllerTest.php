<?php

use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\StockProduct;
use App\Models\SupportTicket;
use App\Models\User;
use App\Models\UserPlant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('retorna a lista de categorias com contagem de produtos', function () {
    Category::factory()->count(3)->create();
    StockProduct::factory()->count(5)->create();

    $response = $this->getJson('/api/categories');

    $response->assertStatus(200)
        ->assertJsonStructure([
            '*' => ['id', 'name', 'mostrarLoja', 'mostrarBlog', 'number'],
        ]);
});

it('cria uma categoria com sucesso', function () {
    $data = ['name' => 'Nova Categoria'];

    $response = $this->postJson('/api/categories/addCategory', $data);

    // Verifica o status e a mensagem de sucesso
    $response->assertStatus(201)
        ->assertJsonFragment([
            'message' => 'Categoria adicionada com sucesso!',
        ]);
});

it('retorna erro ao tentar criar uma categoria duplicada', function () {
    $category = Category::factory()->create(['name' => 'Categoria Existente']);

    $response = $this->postJson('/api/categories/addCategory', ['name' => $category->name]); // Atualizar URL para /addCategory

    $response->assertStatus(409)
        ->assertJsonFragment(['message' => 'A categoria já existe!']);
});

it('retorna uma categoria específica por ID', function () {
    $category = Category::factory()->create();

    $response = $this->getJson("/api/categories/{$category->id}"); // Atualizar URL para /categories/{id}

    $response->assertStatus(200)
        ->assertJsonFragment(['id' => $category->id, 'name' => $category->name]);
});

it('retorna erro ao tentar procurar uma categoria inexistente', function () {
    $response = $this->getJson('/api/categories/999'); // Atualizar URL para /categories/{id}

    $response->assertStatus(404)
        ->assertJsonFragment(['error' => 'Categoria não encontrada']);
});

it('atualiza uma categoria com sucesso', function () {
    $category = Category::factory()->create();

    $data = ['name' => 'Categoria Atualizada', 'mostrarLoja' => true, 'mostrarBlog' => false];

    $response = $this->putJson("/api/categories/{$category->id}", $data); // Atualizar URL para /categories/{id}

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Categoria atualizada com sucesso!']);
});

it('elimina uma categoria existente com sucesso', function () {
    $category = Category::factory()->create();

    $response = $this->deleteJson("/api/categories/{$category->id}"); // Atualizar URL para /categories/{id}

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Categoria apagarda com sucesso!']);
});

it('retorna erro ao tentar eliminar uma categoria inexistente', function () {
    $response = $this->deleteJson('/api/categories/999'); // Atualizar URL para /categories/{id}

    $response->assertStatus(404)
        ->assertJsonFragment(['message' => 'Categoria não encontrada!']);
});

it('retorna estatísticas do dashboard', function () {
    User::factory()->count(10)->create();
    OrderItem::factory()->count(5)->create();
    Order::factory()->count(3)->create();
    UserPlant::factory()->count(7)->create();
    StockProduct::factory()->count(15)->create();
    SupportTicket::factory()->state(['status' => 'closed'])->count(4)->create();

    $response = $this->getJson('/api/dashboard-stats');

    $response->assertStatus(200)
        ->assertJsonStructure([
            'message',
            'totalUsers',
            'totalProductsSold',
            'totalSales',
            'totalActiveGardens',
            'totalProducts',
            'totalQuestionsAnswered',
        ]);
});

it('retorna produtos vendidos por categoria', function () {
    $category = Category::factory()->create();
    $product = StockProduct::factory()->state(['categories_id' => $category->id])->create();
    OrderItem::factory()->state(['stock_products_id' => $product->id, 'quantity' => 10])->create();

    $response = $this->getJson('/api/products-sold-by-category');

    $response->assertStatus(200)
        ->assertJsonFragment([
            'category' => $category->name,
            'total_sold' => '10', // Note que total_sold está como string no retorno
        ]);
});

it('retorna vendas mensais agrupadas por dia', function () {
    Order::factory()->state(['created_at' => now()->startOfMonth(), 'total_amount' => 200])->create();

    $response = $this->getJson('/api/monthly-sales');

    $response->assertStatus(200)
        ->assertJsonStructure([
            now()->format('m') => [
                '*' => ['day', 'total_sales'],
            ],
        ]);
});

it('retorna dados de plantas por dia', function () {
    UserPlant::factory()->state(['created_at' => now()->subDays(1)])->create();
    UserPlant::factory()->state(['created_at' => now()])->create();

    $response = $this->getJson('/api/plant-data-by-day');

    $response->assertStatus(200)
        ->assertJsonStructure([
            '*' => ['day', 'daily_total', 'cumulative_total'],
        ]);
});

it('retorna todos os tickets de suporte', function () {
    SupportTicket::factory()->count(3)->create();

    $response = $this->getJson('/api/tickets');

    $response->assertStatus(200)
        ->assertJsonStructure([['id', 'subject', 'status', 'created_at', 'updated_at']]);
});

it('atualiza um ticket de suporte com sucesso', function () {
    $ticket = SupportTicket::factory()->create();

    $data = ['status' => 'closed', 'response' => 'Resposta testada'];

    $response = $this->putJson("/api/updateTicket/{$ticket->id}", $data);

    $response->assertStatus(200)
        ->assertJsonFragment(['status' => 'closed', 'response' => 'Resposta testada']);
});

it('apagar um ticket de suporte com sucesso', function () {
    $ticket = SupportTicket::factory()->create();

    $response = $this->deleteJson("/api/deleteTicket/{$ticket->id}");

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Ticket iliminado com sucesso']);
});
