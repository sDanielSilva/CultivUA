<?php

use App\Models\User;
use App\Models\Plant;
use App\Models\UserPlant;
use App\Models\Kit;
use App\Models\KitReading;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;

uses(RefreshDatabase::class);

it('retorna as plantas associadas ao utilizador', function () {
    // Crie um user
    $user = User::factory()->create();

    // Crie algumas plantas e associe-as ao user
    $plants = Plant::factory()->count(3)->create();
    foreach ($plants as $plant) {
        UserPlant::factory()->create([
            'users_id' => $user->id,
            'plants_id' => $plant->id,
        ]);
    }

    // Faça a requisição para obter as plantas do user
    $response = $this->actingAs($user)->getJson("/api/user-plants/{$user->id}");

    // Verifica se a resposta tem status 200 e as plantas associadas
    $response->assertStatus(200);
});

it('can get user plants with kits', function () {
    // Crie um user
    $user = User::factory()->create();

    // Crie algumas plantas
    $plants = Plant::factory()->count(2)->create();

    // Crie um kit
    $kit = Kit::factory()->create();

    // Associe as plantas ao user
    foreach ($plants as $plant) {
        $userPlantId = DB::table('users_plants')->insertGetId([
            'users_id' => $user->id,
            'plants_id' => $plant->id,
        ]);

        // Associe o kit à planta
        DB::table('plants_kits')->insert([
            'user_plant_id' => $userPlantId,
            'kits_id' => $kit->id,
        ]);
    }

    // Faça a requisição para obter as plantas do user com os kits
    $response = $this->actingAs($user)->getJson("/api/user-plants-kits/{$user->id}");

    // Verifica se a resposta tem status 200
    $response->assertOk();

    // Verifica a estrutura JSON da resposta
    $response->assertJsonStructure([
        '*' => [  // ' * ' significa verificar cada item da resposta (um array de objetos)
            'user_plant_id',
            'id',
            'name',
            'kit_id',
            'kit_name',
            'kit_codigo',
        ],
    ]);
});

it('returns 404 if plant not found by ID', function () {
    // Crie um user
    $user = User::factory()->create();

    // Faça a requisição autenticando o user e com um ID de planta inexistente
    $response = $this->actingAs($user)->getJson("/api/plants/999");  // 999 é um ID de planta inexistente
    
    // Verifica se o código de status retornado é 404 (não encontrado)
    $response->assertNotFound();

});