<?php

use App\Models\User;
use App\Models\UserPlant;
use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;

uses(RefreshDatabase::class);

it('returns plant information for a specific user plant when user_plant_id is provided', function () {
    // Cria um user e uma planta associada a ele
    $user = User::factory()->create();
    $location = Location::factory()->create(); // Localização para a planta
    $userPlant = UserPlant::factory()->create([
        'users_id' => $user->id,
        'location_id' => $location->id,
    ]);

    // Autentica o user
    $this->actingAs($user, 'api');

    // Chama a rota com a query string 'user_plant_id'
    $response = $this->getJson('api/planta-info' . $userPlant->id);

    // Verifica a resposta
    $response->assertStatus(200);
});

it('returns 404 when plant is not found with the provided user_plant_id', function () {
    $user = User::factory()->create();

    // Autentica o user
    $this->actingAs($user, 'api');

    // Faz a requisição com um ID de planta que não existe
    $response = $this->getJson('/api/planta-info?user_plant_id=999999'); // ID que não existe

    // Verifica se o erro 404 é retornado
    $response->assertStatus(404);

});

it('returns all user plants if no user_plant_id is provided', function () {
    // Cria um user e várias plantas associadas a ele
    $user = User::factory()->create();
    $location = Location::factory()->create(); // Localização para a planta
    $userPlants = UserPlant::factory()->count(3)->create([
        'users_id' => $user->id,
        'location_id' => $location->id,
    ]);

    // Autentica o user
    $this->actingAs($user, 'api');

    // Chama a rota sem a query string 'user_plant_id'
    $response = $this->getJson('/api/planta-info');

    // Verifica a resposta
    $response->assertStatus(200);
    $response->assertJsonCount(3); // Verifica se retornou 3 plantas
    $response->assertJsonFragment(['name' => $userPlants[0]->name]); // Verifica se uma das plantas está presente
});
