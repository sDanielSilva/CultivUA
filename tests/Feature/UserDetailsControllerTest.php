<?php
use App\Models\User;
use App\Models\SupportTicket;
use Illuminate\Support\Facades\Hash;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    // Configura o ambiente, se necessário.
    $this->user = User::factory()->create();
});

it('retrieves user details successfully', function () {
    // Autentica o user
    $this->actingAs($this->user);

    // Realiza a requisição GET para obter os detalhes do user
    $response = $this->getJson("/api/userdetails/{$this->user->id}");

    // Verifica a resposta
    $response->assertStatus(200)
             ->assertJson([
                 'username' => $this->user->username,
                 'email' => $this->user->email,
                 'newsletter' => $this->user->newsletter,
                 'imagem' => $this->user->imagem,
             ]);
});

it('returns error when user details are not found', function () {
    // Tenta acessar detalhes de um user inexistente
    $response = $this->getJson('/api/userdetails/9999'); // Um ID inexistente

    $response->assertStatus(404)
             ->assertJson(['message' => 'Utilizador não encontrado']);
});

it('updates user details successfully', function () {
    $this->actingAs($this->user);

    // Dados atualizados para o user
    $data = [
        'username' => 'updatedusername',
        'email' => 'updatedemail@example.com',
    ];

    // Realiza a requisição PUT para atualizar os detalhes do user
    $response = $this->putJson("/api/updateuser/{$this->user->id}", $data);

    $response->assertStatus(200)
             ->assertJson(['message' => 'Utilizador atualizado com sucesso']);

    // Verifica se os dados foram realmente atualizados no banco de dados
    $this->user->refresh();
    expect($this->user->username)->toBe('updatedusername');
    expect($this->user->email)->toBe('updatedemail@example.com');
});

it('returns error when username is already taken', function () {
    // Cria outro user para testar o conflito
    $otherUser = User::factory()->create();

    $this->actingAs($this->user);

    // Dados de username em conflito
    $data = [
        'username' => $otherUser->username, // Username já em uso
        'email' => 'newemail@example.com',
    ];

    $response = $this->putJson("/api/updateuser/{$this->user->id}", $data);

    $response->assertStatus(409)
             ->assertJson(['message' => 'O username já está em uso. Escolha outro username.']);
});

it('returns error when email is already taken', function () {
    // Cria outro user para testar o conflito de e-mail
    $otherUser = User::factory()->create();

    $this->actingAs($this->user);

    // Dados de e-mail em conflito
    $data = [
        'username' => 'newusername',
        'email' => $otherUser->email, // E-mail já em uso
    ];

    $response = $this->putJson("/api/updateuser/{$this->user->id}", $data);

    $response->assertStatus(409)
             ->assertJson(['message' => 'O email já está em uso. Escolha outro email.']);
});

it('updates password successfully', function () {
    $this->actingAs($this->user);

    $data = [
        'currentPassword' => 'password', // Password atual
        'newPassword' => 'newpassword', // Nova password
        'newPassword_confirmation' => 'newpassword',
    ];

    $response = $this->putJson("/api/update-password/{$this->user->id}", $data);

    $response->assertStatus(200)
             ->assertJson(['message' => 'Password atualizada com sucesso']);

    // Verifica se a password foi realmente alterada
    expect(Hash::check('newpassword', $this->user->fresh()->password))->toBeTrue();
});

it('returns error when current password is incorrect', function () {
    $this->actingAs($this->user);

    $data = [
        'currentPassword' => 'wrongpassword', // Password incorreta
        'newPassword' => 'newpassword',
        'newPassword_confirmation' => 'newpassword',
    ];

    $response = $this->putJson("/api/update-password/{$this->user->id}", $data);

    $response->assertStatus(400)
             ->assertJson(['message' => 'A password atual está incorreta']);
});

it('retrieves user tickets successfully', function () {
    $this->actingAs($this->user);

    // Cria um ticket de suporte para o user
    $ticket = SupportTicket::factory()->create([
        'user_id' => $this->user->id,
    ]);

    // Realiza a requisição GET para obter os tickets do user
    $response = $this->getJson('/api/tickets-user');

    $response->assertStatus(200)
             ->assertJsonFragment([
                 'subject' => $ticket->subject,
                 'message' => $ticket->message,
             ]);
});

it('returns error when user has no tickets', function () {
    $this->actingAs($this->user);

    // Realiza a requisição GET para obter os tickets do user
    $response = $this->getJson('/api/tickets-user');

    $response->assertStatus(200)
             ->assertJson([]);
});
