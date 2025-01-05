<?php

use App\Models\User;
use App\Models\Notification;
use App\Models\Admin;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

it('returns notifications for authenticated user', function () {
    // Cria um user autenticado
    $user = User::factory()->create();
    $this->actingAs($user, 'api');

    // Cria algumas notificações para o user
    Notification::factory()->count(3)->create(['users_id' => $user->id]);

    // Chama a rota de notificações
    $response = $this->getJson('/api/notifications');

    // Verifica se a resposta contém as notificações
    $response->assertStatus(200);
});

it('returns 401 when user is not authenticated', function () {
    // Faz uma requisição sem autenticação
    $response = $this->getJson('/api/notifications');

    // Verifica se o status é 401
    $response->assertStatus(401)
             ->assertJson(['message' => 'Unauthenticated.']);
});

it('returns 401 when non-admin user tries to access admin notifications', function () {
    // Cria um user não administrador
    $user = User::factory()->create();
    $this->actingAs($user, 'api');

    // Chama a rota de notificações de admin
    $response = $this->getJson('/api/notifications/admin');

    // Verifica se o status é 401
    $response->assertStatus(401)
             ->assertJson(['message' => 'Unauthenticated.']);
});

it('returns notifications for specific user', function () {
    // Cria um user
    $user = User::factory()->create();

    // Cria algumas notificações para o user
    $notifications = Notification::factory()->count(5)->create(['users_id' => $user->id]);

    // Chama a rota para pegar as notificações do user
    $response = $this->getJson("/api/notifications/{$user->id}");

    // Verifica se a resposta contém as notificações
    $response->assertStatus(200)
             ->assertJsonCount(2)
             ->assertJsonFragment(['users_id' => $user->id]); // Verifica que as notificações pertencem ao user
});

it('marks notification as read', function () {
    // Cria uma notificação
    $notification = Notification::factory()->create(['is_read' => 0]);

    // Chama a rota para marcar a notificação como lida
    $response = $this->putJson("/api/notifications/{$notification->id}/mark-read");

    // Verifica se a resposta é bem-sucedida
    $response->assertStatus(200)
             ->assertJson(['success' => true]);

    // Verifica se a notificação foi marcada como lida
    $notification->refresh();
    expect($notification->is_read)->toBe(1);
});