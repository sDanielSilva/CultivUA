<?php

use App\Models\User;
use App\Models\Kit;
use App\Models\UserPlant;
use App\Models\PlantsKit;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);



it('checks if a kit code is available', function () {
    // Cria um kit que já está associado
    $kit = Kit::factory()->create(['isAssociated' => true]);

    // Envia a requisição para verificar se o código está disponível
    $response = $this->getJson("/api/kits/check-code/{$kit->codigo}");

    // Verifica a resposta
    $response->assertStatus(200)
             ->assertJson([
                 'available' => false,
                 'message' => 'Kit já está associado a uma planta.',
             ]);

    // Cria um kit não associado
    $newKit = Kit::factory()->create(['isAssociated' => false]);

    // Envia a requisição novamente para o novo kit
    $response = $this->getJson("/api/kits/check-code/{$newKit->codigo}");

    // Verifica a resposta para o novo kit
    $response->assertStatus(200)
             ->assertJson([
                 'available' => true,
                 'message' => 'Código do kit disponível.',
             ]);
});

it('updates the name of a kit', function () {
    // Cria um kit
    $kit = Kit::factory()->create();

    // Envia a requisição para atualizar o nome do kit
    $response = $this->putJson("/api/kits/{$kit->id}/update-name", [
        'name' => 'Kit Atualizado',
    ]);

    // Verifica a resposta
    $response->assertStatus(200)
             ->assertJson(['message' => 'Nome do kit atualizado com sucesso.'])
             ->assertJsonFragment(['name' => 'Kit Atualizado']);

    // Verifica se o nome foi atualizado no banco de dados
    $kit->refresh();
    $this->assertEquals('Kit Atualizado', $kit->name);
});
