<?php

use App\Models\StockProduct;
use App\Models\Category;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('retrieves the latest products', function () {
    // Cria alguns produtos
    $products = StockProduct::factory()->count(5)->create();

    // Envia a requisição GET
    $response = $this->getJson('/api/novidades');

    // Verifica se o status é 200
    $response->assertStatus(200);

    // Verifica se os produtos estão na resposta
    $response->assertJsonCount(5);
    $response->assertJsonStructure([
        '*' => [
            'id', 'name', 'price', 'imagem', 'created_at'
        ]
    ]);
});

it('retrieves the best-selling products', function () {
    // Cria algumas categorias
    $category = Category::factory()->create();

    // Cria alguns produtos
    $products = StockProduct::factory(5)->create([
        'categories_id' => $category->id,
    ]);

    // Cria algumas vendas para os produtos
    foreach ($products as $product) {
        // Cria 3 vendas para cada produto
        \App\Models\OrderItem::factory(3)->create([
            'stock_products_id' => $product->id,
            'quantity' => 10,  // Quantidade vendida
            'created_at' => now()->subDays(rand(1, 30)), // Data aleatória dentro dos últimos 30 dias
        ]);
    }

    // Envia a requisição GET para os produtos mais vendidos
    $response = $this->getJson('/api/mais-vendidos');

    // Verifica se a resposta tem status 200
    $response->assertStatus(200);

    // Verifica se retornou 5 produtos (os melhores vendidos)
    $response->assertJsonCount(5);

    // Verifica se os produtos retornados têm a estrutura esperada
    $response->assertJsonStructure([
        '*' => [
            'id',
            'name',
            'price',
            'imagem',
            'total_sales',
        ],
    ]);
});

it('retrieves popular products', function () {
    // Cria algumas categorias
    $category = Category::factory()->create();

    // Cria alguns produtos
    $products = StockProduct::factory(5)->create([
        'categories_id' => $category->id,
    ]);

    // Cria algumas vendas para os produtos (quantidade total de 10 para cada venda)
    foreach ($products as $product) {
        // Cria 3 vendas para cada produto
        \App\Models\OrderItem::factory(3)->create([
            'stock_products_id' => $product->id,
            'quantity' => 10,  // Quantidade vendida
            'created_at' => now()->subDays(rand(1, 30)), // Data aleatória dentro dos últimos 30 dias
        ]);
    }

    // Envia a requisição GET para os produtos populares
    $response = $this->getJson('/api/populares');

    // Verifica se a resposta tem status 200
    $response->assertStatus(200);

    // Verifica se retornou 5 produtos populares (os que têm mais vendas)
    $response->assertJsonCount(5);

    // Verifica se os produtos retornados têm a estrutura esperada
    $response->assertJsonStructure([
        '*' => [
            'id',
            'name',
            'price',
            'imagem',
            'total_sales',
        ],
    ]);
});

it('retrieves filtered products with categories', function () {
    // Cria alguns produtos e categorias
    $category = Category::factory()->create();
    $products = StockProduct::factory()->count(5)->create([
        'categories_id' => $category->id
    ]);

    // Envia a requisição GET
    $response = $this->getJson('/api/products2');

    // Verifica se o status é 200
    $response->assertStatus(200);

    // Verifica se os produtos estão na resposta
    $response->assertJsonCount(5);
    $response->assertJsonStructure([
        '*' => [
            'id', 'name', 'price', 'stock', 'imagem', 'category_name', 'created_at', 'scientific_name', 'isKit', 'description', 'size'
        ]
    ]);
});

it('retrieves a product by its ID', function () {
    // Cria um produto
    $product = StockProduct::factory()->create();

    // Envia a requisição GET
    $response = $this->getJson("/api/products/{$product->id}");

    // Verifica se o status é 200
    $response->assertStatus(200);

    // Verifica se o produto está na resposta
    $response->assertJson([
        'id' => $product->id,
        'name' => $product->name,
        'price' => $product->price,
        'stock' => $product->stock,
        'imagem' => $product->imagem,
        'scientific_name' => $product->scientific_name,
        'description' => $product->description,
        'size' => $product->size,
    ]);
});

it('deletes a product by its ID', function () {
    // Cria um produto
    $product = StockProduct::factory()->create();

    // Envia a requisição DELETE
    $response = $this->deleteJson("/api/products/{$product->id}");

    // Verifica se o status é 200
    $response->assertStatus(200);

    // Verifica se a resposta contém a mensagem de sucesso
    $response->assertJson(['message' => 'Produto excluído com sucesso']);

    // Verifica se o produto foi excluído do banco de dados
    $this->assertDatabaseMissing('stock_products', ['id' => $product->id]);
});

it('creates a new product', function () {
    // Dados do produto
    $data = [
        'name' => 'Produto Teste',
        'price' => 100,
        'stock' => 10,
        'categories_id' => Category::factory()->create()->id,
        'threshold' => 5,
        'scientific_name' => 'Nome Científico',
        'description' => 'Descrição do Produto',
        'size' => 'M',
        'isKit' => false,
    ];

    // Envia a requisição POST
    $response = $this->postJson('/api/products', $data);

    // Verifica se o status é 201
    $response->assertStatus(201);

    // Verifica se a resposta contém a mensagem de sucesso
    $response->assertJson([
        'message' => 'Produto criado com sucesso!',
    ]);

    // Verifica se o produto foi criado no banco de dados
    $this->assertDatabaseHas('stock_products', [
        'name' => 'Produto Teste',
        'price' => 100,
        'stock' => 10,
    ]);
});

it('updates a product', function () {
    // Cria uma categoria
    $category = Category::factory()->create();

    // Cria um produto
    $product = StockProduct::factory()->create([
        'categories_id' => $category->id,
    ]);

    // Dados para atualização
    $data = [
        'name' => 'Produto Atualizado',
        'price' => 150,
        'stock' => 20,
        'threshold' => 10,
        'isKit' => true,
        'categories_id' => $category->id,  // Garante de passar o categories_id
    ];

    // Envia a requisição PUT
    $response = $this->putJson("/api/updateProduct/{$product->id}", $data);

    // Verifica se o status é 200
    $response->assertStatus(200);

    // Verifica se a resposta contém a mensagem de sucesso
    $response->assertJson(['message' => 'Produto atualizado com sucesso!']);

    // Verifica se o produto foi atualizado no banco de dados
    $product->refresh();
    $this->assertEquals('Produto Atualizado', $product->name);
    $this->assertEquals(150, $product->price);
    $this->assertEquals(20, $product->stock);
    $this->assertEquals($category->id, $product->categories_id);  // Verifica se o categories_id foi atualizado
});
