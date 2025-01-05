<?php

namespace Database\Factories;

use App\Models\Sensor;
use App\Models\Plant;  // Importar o modelo Plant
use App\Models\Location; // Importar o modelo Location
use Illuminate\Database\Eloquent\Factories\Factory;

class SensorFactory extends Factory
{
    protected $model = Sensor::class;

    public function definition()
    {
        return [
            'plants_id' => Plant::factory(), // Associa a um registro de Plant
            'type' => $this->faker->randomElement(['temperature', 'humidity', 'light']),
            'locations_id' => Location::factory(), // Cria um novo registro de Location
        ];
    }
}
