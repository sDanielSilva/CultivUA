<?php

namespace Database\Factories;

use App\Models\Plant;
use Illuminate\Database\Eloquent\Factories\Factory;

class PlantFactory extends Factory
{
    protected $model = Plant::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word(),
            'species' => $this->faker->word(), // Adicionado 'species'
            'description' => $this->faker->text(),
            'ideal_temperature' => $this->faker->numberBetween(15, 30), // Temperatura ideal entre 15°C e 30°C
            'ideal_humidity' => $this->faker->numberBetween(40, 80), // Umidade ideal entre 40% e 80%
            'harvest_season' => $this->faker->word(), // Temporada de colheita
            //'ideial_light' => $this->faker->randomElement([0, 4, 5]), // Tipo de luz
            'watering_frequency' => $this->faker->randomElement(['daily', 'weekly', 'biweekly']), // Frequência de rega
            'buffer_percentage' => $this->faker->numberBetween(0, 100), // Porcentagem de buffer
        ];
    }
}
