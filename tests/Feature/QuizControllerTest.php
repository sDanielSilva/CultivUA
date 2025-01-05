<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('submits quiz responses and retrieves compatible plants', function () {
    $responses = [
        'responses' => [
            'edible' => 'Sim',
            'indoor' => 'Interior',
            'watering' => 'Pouca',
            'cycle' => 'Perene',
            'sunlight' => 'Sol pleno',
        ]
    ];

    Http::fake([
        'perenual.com/api/species-list*' => Http::response([
            'data' => [
                ['name' => 'Planta 1', 'id' => 1],
                ['name' => 'Planta 2', 'id' => 2],
            ]
        ], 200)
    ]);

    $response = $this->postJson('/api/quiz/submit', $responses);

    $response->assertStatus(200)
             ->assertJson([
                 ['name' => 'Planta 1', 'id' => 1],
                 ['name' => 'Planta 2', 'id' => 2],
             ]);
});

it('returns an error when responses are invalid', function () {
    $response = $this->postJson('/api/quiz/submit', []);

    $response->assertStatus(422)
             ->assertJsonValidationErrors(['responses']);
});

it('returns an error when the external API fails', function () {
    $responses = [
        'responses' => [
            'edible' => 'Sim',
            'indoor' => 'Interior',
            'watering' => 'Pouca',
            'cycle' => 'Perene',
            'sunlight' => 'Sol pleno',
        ]
    ];

    Http::fake([
        'perenual.com/api/species-list*' => Http::response([], 500)
    ]);

    $response = $this->postJson('/api/quiz/submit', $responses);

    $response->assertStatus(500)
             ->assertJson(['error' => 'Não foi possível obter as plantas.']);
});
