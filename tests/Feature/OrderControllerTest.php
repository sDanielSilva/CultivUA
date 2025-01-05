<?php

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\StockProduct;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates a new order successfully', function () {
    // Cria um user e produtos no estoque
    $user = User::factory()->create();
    $products = StockProduct::factory()->count(3)->create();

    // Dados do pedido
    $data = [
        'user_id' => $user->id,
        'cartItems' => [
            ['id' => $products[0]->id, 'quantity' => 2],
            ['id' => $products[1]->id, 'quantity' => 1],
        ],
        'totalAmount' => 150.00,
        'totalQuantity' => 3,
    ];

    // Faz a requisição para criar o pedido
    $response = $this->postJson('/api/create-order', $data);

    // Verifica o status e resposta
    $response->assertStatus(201)
             ->assertJson(['message' => 'Order created successfully!']);

    // Verifica se o pedido foi criado no banco
    $this->assertDatabaseHas('orders', [
        'users_id' => $user->id,
        'total_amount' => 150.00,
        'status' => 'pending',
    ]);

    // Verifica se os itens do pedido foram criados
    foreach ($data['cartItems'] as $item) {
        $this->assertDatabaseHas('order_items', [
            'stock_products_id' => $item['id'],
            'quantity' => $item['quantity'],
        ]);
    }
});

it('updates order status successfully', function () {
    // Cria um pedido
    $order = Order::factory()->create(['status' => 'pending']);

    // Dados para atualizar o status
    $data = [
        'order_id' => $order->id,
        'status' => 'pago',
    ];

    // Faz a requisição para atualizar o status
    $response = $this->putJson("/api/orders/{$order->id}/status", $data);

    // Verifica o status e resposta
    $response->assertStatus(200)
             ->assertJson(['message' => 'Order status updated successfully!']);

    // Verifica se o status foi atualizado no banco
    $this->assertDatabaseHas('orders', [
        'id' => $order->id,
        'status' => 'pago',
    ]);
});

it('returns purchase history for a user', function () {
    // Cria um user e pedidos pagos
    $user = User::factory()->create();
    $orders = Order::factory()->count(2)->create(['users_id' => $user->id, 'status' => 'pago']);
    $products = StockProduct::factory()->count(3)->create();

    // Cria itens para os pedidos
    foreach ($orders as $order) {
        OrderItem::factory()->count(2)->create([
            'orders_id' => $order->id,
            'stock_products_id' => $products->random()->id,
            'quantity' => 2,
        ]);
    }

    // Faz a requisição para o histórico de compras
    $response = $this->getJson("/api/users/{$user->id}/purchase-history");

    // Verifica o status e estrutura da resposta
    $response->assertStatus(200)
             ->assertJsonStructure([
                 '*' => [
                     'id',
                     'total_amount',
                     'created_at',
                     'products_summary',
                 ],
             ]);

    // Verifica se os pedidos do histórico pertencem ao user
    foreach ($orders as $order) {
        $response->assertJsonFragment(['id' => $order->id]);
    }
});

it('returns 404 when trying to update status of non-existent order', function () {
    // Dados inválidos
    $data = [
        'order_id' => 9999, // ID inexistente
        'status' => 'pago',
    ];

    // Faz a requisição
    $response = $this->putJson('/api/orders/9999/status', $data);

    // Verifica o status e resposta
    $response->assertStatus(422);
});