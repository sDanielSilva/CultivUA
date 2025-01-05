<?php
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('updates the user profile with valid data', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $data = [
        'username' => 'novoUsername',
        'email' => 'novoemail@example.com',
        'password' => 'novaPassword123',
        'password_confirmation' => 'novaPassword123'
    ];

    $response = $this->putJson('/api/user/profile', $data);

    $response->assertStatus(200)
             ->assertJson(['message' => 'Perfil atualizado com sucesso'])
             ->assertJsonFragment(['username' => 'novoUsername'])
             ->assertJsonFragment(['email' => 'novoemail@example.com']);
});

it('returns error when email is already taken', function () {
    $user1 = User::factory()->create(['email' => 'existing@example.com']);
    $user2 = User::factory()->create();
    $this->actingAs($user2);

    $data = [
        'email' => 'existing@example.com',
    ];

    $response = $this->putJson('/api/user/profile', $data);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['email']);
});

it('returns error when password is too short', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $data = [
        'password' => 'short',
        'password_confirmation' => 'short'
    ];

    $response = $this->putJson('/api/user/profile', $data);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['password']);
});

it('retrieves the authenticated user profile', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->getJson('/api/user/profile');

    $response->assertStatus(200)
             ->assertJsonFragment(['username' => $user->username])
             ->assertJsonFragment(['email' => $user->email]);
});

it('returns error if user is not authenticated', function () {
    $response = $this->getJson('/api/user/profile');

    $response->assertStatus(401)
             ->assertJson(['message' => 'Unauthenticated.']);
});

it('updates the newsletter subscription', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $data = [
        'newsletter' => true,
    ];

    $response = $this->putJson("/api/users/{$user->id}/newsletter", $data);

    $response->assertStatus(200)
             ->assertJson(['message' => 'Subscrição atualizada com sucesso!']);
    $user->refresh();
    expect($user->newsletter)->toBe(1);
});

it('returns error when invalid newsletter value is provided', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $data = [
        'newsletter' => 'invalid',
    ];

    $response = $this->putJson("/api/users/{$user->id}/newsletter", $data);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['newsletter']);
});

it('updates the user profile picture with a valid base64 image', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANS...'; 

    $data = [
        'imagem' => $base64Image
    ];

    $response = $this->putJson("/api/users/{$user->id}/profile-picture", $data);

    $response->assertStatus(200)
             ->assertJson(['message' => 'Imagem atualizada com sucesso!']);
    $user->refresh();
    expect($user->imagem)->toBe($base64Image);
});

it('returns error when the image format is invalid', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $invalidBase64Image = 'invalidbase64string';

    $data = [
        'imagem' => $invalidBase64Image
    ];

    $response = $this->putJson("/api/users/{$user->id}/profile-picture", $data);

    $response->assertStatus(400)
             ->assertJson(['message' => 'Formato de imagem inválido.']);
});
