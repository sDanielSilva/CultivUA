<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Admin;

// Usa RefreshDatabase para garantir que o banco seja resetado entre os testes
uses(RefreshDatabase::class);

// Teste do método login
test('admin pode realizar login com credenciais válidas', function () {
    // Cria um admin no banco
    $admin = Admin::factory()->create([
        'username' => 'adminuser',
        'password' => Hash::make('password123'),
    ]);

    // Faz a chamada POST para o endpoint de login
    $response = $this->postJson('/api/admin/login', [
        'username' => 'adminuser',
        'password' => 'password123',
    ]);

    // Verifica o status e a estrutura da resposta
    $response->assertStatus(200)
        ->assertJsonStructure([
            'id',
            'token',
            'email',
            'user_type', // 'user_type' agora está correto com base no controller
        ]);

    // Verifica se o token foi gerado
    $this->assertNotEmpty($response->json('token'));
});

test('login falha com credenciais inválidas', function () {
    // Faz a chamada POST com credenciais incorretas
    $response = $this->postJson('/api/admin/login', [
        'username' => 'adminuser',
        'password' => 'wrongpassword',
    ]);

    // Verifica o status e a mensagem de erro
    $response->assertStatus(401)
        ->assertJson([
            'error' => 'Unauthorized',
        ]);
});

test('validação de campos de login falha com dados ausentes', function () {
    // Faz a chamada POST sem credenciais
    $response = $this->postJson('/api/admin/login', []);

    // Verifica se há erros de validação
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['username', 'password']);
});

// Teste do método logout
test('admin pode realizar logout com sucesso', function () {
    // Cria um admin e autentica ele
    $admin = Admin::factory()->create();
    $token = $admin->createToken('AdminToken')->plainTextToken;

    // Faz a chamada POST para logout
    $response = $this->withHeaders(['Authorization' => "Bearer $token"])
        ->postJson('/api/admin/logout');

    // Verifica a resposta de sucesso
    $response->assertStatus(200)
        ->assertJson(['message' => 'Logout realizado com sucesso']);
});

test('logout falha se o admin não estiver autenticado', function () {
    // Faz a chamada POST para logout sem autenticação
    $response = $this->postJson('/api/admin/logout');

    // Verifica a resposta de erro
    $response->assertStatus(401)
        ->assertJson(['message' => 'Unauthenticated.']);
});
