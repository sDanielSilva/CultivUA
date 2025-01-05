<?php

use App\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

it('can get all locations', function () {
    // Criar algumas locations para o teste
    Location::factory()->create(['name' => 'Location 1']);
    Location::factory()->create(['name' => 'Location 2']);
    
    // Realiza a requisição GET
    $response = $this->get('/api/locations');
    
    // Verifica se o status da resposta é 200 e se os dados estão presentes
    $response->assertStatus(200)
             ->assertJsonCount(2) // Verifica se há duas locations
             ->assertJson([
                ['name' => 'Location 1'],
                ['name' => 'Location 2'],
             ]);
});

it('can show a specific location', function () {
    // Criar uma location para o teste
    $location = Location::factory()->create(['name' => 'Location 1']);
    
    // Realiza a requisição GET para a rota específica
    $response = $this->get("/api/locations/{$location->id}");
    
    // Verifica se a resposta tem status 200 e os dados da location
    $response->assertStatus(200)
             ->assertJson([
                 'id' => $location->id,
                 'name' => 'Location 1',
             ]);
});

it('returns 404 when trying to show a non-existent location', function () {
    // Realiza a requisição GET para uma location inexistente
    $response = $this->get('/api/locations/999');
    
    // Verifica se a resposta é 404 e a mensagem de erro
    $response->assertStatus(404)
             ->assertJson([
                 'error' => 'Location not found',
             ]);
});

it('can store a new location', function () {
    // Dados para a criação da location
    $data = ['name' => 'New Location'];
    
    // Realiza a requisição POST para criar a location
    $response = $this->post('/api/locations', $data);
    
    // Verifica se o status é 201 e a location foi criada corretamente
    $response->assertStatus(201)
             ->assertJson([
                 'name' => 'New Location',
             ]);
    
    // Verifica se a location foi realmente guarda no banco
    $this->assertDatabaseHas('locations', ['name' => 'New Location']);
});


it('can update an existing location', function () {
    // Criar uma location para o teste
    $location = Location::factory()->create(['name' => 'Old Location']);
    
    // Dados para atualização
    $data = ['name' => 'Updated Location'];
    
    // Realiza a requisição PUT para atualizar a location
    $response = $this->put("/api/locations/{$location->id}", $data);
    
    // Verifica se o status é 200 e a location foi atualizada corretamente
    $response->assertStatus(200)
             ->assertJson([
                 'name' => 'Updated Location',
             ]);
    
    // Verifica se os dados foram atualizados no banco
    $this->assertDatabaseHas('locations', ['name' => 'Updated Location']);
});

it('returns 404 when trying to update a non-existent location', function () {
    // Dados para atualização
    $data = ['name' => 'Updated Location'];
    
    // Realiza a requisição PUT para uma location inexistente
    $response = $this->put('/api/locations/999', $data);
    
    // Verifica se o status é 404 e a mensagem de erro
    $response->assertStatus(404)
             ->assertJson([
                 'message' => 'Location not found',
             ]);
});

it('can delete an existing location', function () {
    // Criar uma location para o teste
    $location = Location::factory()->create(['name' => 'Location to Delete']);
    
    // Realiza a requisição DELETE para excluir a location
    $response = $this->delete("/api/locations/{$location->id}");
    
    // Verifica se o status é 200 e a mensagem de sucesso
    $response->assertStatus(200)
             ->assertJson([
                 'message' => 'Location deleted successfully',
             ]);
    
    // Verifica se a location foi removida do banco
    $this->assertDatabaseMissing('locations', ['name' => 'Location to Delete']);
});

it('returns 404 when trying to delete a non-existent location', function () {
    // Realiza a requisição DELETE para uma location inexistente
    $response = $this->delete('/api/locations/999');
    
    // Verifica se o status é 404 e a mensagem de erro
    $response->assertStatus(404)
             ->assertJson([
                 'message' => 'Location not found',
             ]);
});
