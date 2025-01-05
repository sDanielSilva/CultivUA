<?php

namespace Database\Factories;

use App\Models\SensorReading;
use App\Models\Sensor;
use Illuminate\Database\Eloquent\Factories\Factory;

class SensorReadingFactory extends Factory
{
    protected $model = SensorReading::class;

    public function definition()
    {
        return [
            'sensors_id' => Sensor::factory(), // Associa a um registro de Sensor
            'data_value' => $this->faker->randomFloat(2, 0, 100), // Valor entre 0 e 100
            'timestmp' => now(),
        ];
    }
}
