<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('regista um novo utilizador com sucesso', function () {
    $data = [
        'username' => 'testuser',
        'email' => 'testuser@example.com',
        'password' => 'password123',
    ];

    $response = $this->postJson('/api/register', $data);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'message',
            'token',
        ]);

    $this->assertDatabaseHas('users', [
        'username' => 'testuser',
        'email' => 'testuser@example.com',
    ]);
});

it('retorna erro ao tentar registrar com email duplicado', function () {
    User::factory()->create(['email' => 'duplicate@example.com']);

    $data = [
        'username' => 'anotheruser',
        'email' => 'duplicate@example.com',
        'password' => 'password123',
    ];

    $response = $this->postJson('/api/register', $data);

    $response->assertStatus(422)
        ->assertJsonFragment(['email' => ['The email has already been taken.']]);
});

it('realiza login com credenciais válidas', function () {
    $user = User::factory()->create([
        'email' => 'validuser@example.com',
        'password' => Hash::make('password123'),
    ]);

    $data = [
        'email' => 'validuser@example.com',
        'password' => 'password123',
    ];

    $response = $this->postJson('/api/login', $data);

    $response->assertStatus(200)
        ->assertJsonStructure([
            'id',
            'token',
            'email',
            'user_type', // Verifica a presença do tipo de user
        ]);

    // Confirma que o utilizador está autenticado
    expect(Auth::check())->toBeTrue();
});

it('retorna erro ao realizar login com credenciais inválidas', function () {
    User::factory()->create([
        'email' => 'validuser@example.com',
        'password' => Hash::make('password123'),
    ]);

    $data = [
        'email' => 'validuser@example.com',
        'password' => 'wrongpassword',
    ];

    $response = $this->postJson('/api/login', $data);

    $response->assertStatus(401)
        ->assertJsonFragment(['error' => 'Unauthorized']);
});

it('realiza logout com sucesso', function () {
    $user = User::factory()->create();
    Sanctum::actingAs($user);

    $response = $this->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJsonFragment(['message' => 'Logout realizado com sucesso']);
});
