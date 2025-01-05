<?php

use App\Models\User;
use App\Models\SupportTicket;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class); // Garantir que o banco de dados seja limpo entre os testes


it('cria um ticket de suporte com sucesso', function () {
    // Crie um utilizador para autenticação
    $user = User::factory()->create();

    // Autenticar o utilizador com Sanctum
    \Laravel\Sanctum\Sanctum::actingAs($user);

  
    $data = [
        'subject' => 'Problema com a conta',
        'message' => 'Estou tendo dificuldades para acessar minha conta.',
    ];

    $response = $this->postJson('/api/ticket-user', $data);

    // Verificar se o status é 201 (Created)
    $response->assertStatus(201)
        ->assertJson([
            'message' => 'Ticket criado com sucesso!',
            'ticket' => [
                'subject' => 'Problema com a conta',
                'message' => 'Estou a ter dificuldades para aceder à minha conta.',
            ],
        ]);

    // Verificar se o ticket foi realmente criado na base de dados
    $this->assertDatabaseHas('support_tickets', [
        'subject' => 'Problema com a conta',
        'message' => 'Estou tendo dificuldades para acessar minha conta.',
        'user_id' => $user->id,
    ]);
});

it('retorna erro ao tentar criar ticket sem estar autenticado', function () {
    // Dados para a criação do ticket
    $data = [
        'subject' => 'Problema com a conta',
        'message' => 'Estou tendo dificuldades para acessar minha conta.',
    ];

    // Fazer a requisição para criar o ticket sem estar autenticado
    $response = $this->postJson('/api/ticket-user', $data);

    // Verificar se o status é 401 (Unauthorized)
    $response->assertStatus(401)
        ->assertJson([
            'message' => 'Unauthenticated.',
        ]);
});

it('retorna erro ao criar ticket com dados inválidos', function () {
    // Crie um user para autenticação
    $user = User::factory()->create();

    // Autenticar o user com Sanctum
    \Laravel\Sanctum\Sanctum::actingAs($user);

    // Dados inválidos para a criação do ticket (faltando subject e message)
    $data = [
        'subject' => '', // Invalido
        'message' => '', // Invalido
    ];

    // Fazer a requisição para criar o ticket com dados inválidos
    $response = $this->postJson('/api/ticket-user', $data);

    // Verificar se o status é 422 (Unprocessable Entity)
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['subject', 'message']);
});