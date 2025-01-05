<?php

namespace Database\Factories;

use App\Models\KitReading;
use App\Models\Kit;
use Illuminate\Database\Eloquent\Factories\Factory;

class KitReadingFactory extends Factory
{
    /**
     * O nome do modelo correspondente à fábrica.
     *
     * @var string
     */
    protected $model = KitReading::class;

    /**
     * Defina o estado padrão do modelo.
     *
     * @return array
     */
    public function definition()
    {
        // A criar um Kit e a associar ao KitReading
        $kit = Kit::factory()->create();  // Cria o Kit e retorna a instância

        return [
            'temperatura' => $this->faker->randomFloat(2, 0, 40), // Temperatura aleatória entre 0 e 40°C
            'luz' => $this->faker->randomFloat(2, 0, 1000), // Luz em lux, variando entre 0 e 1000
            'humidade' => $this->faker->randomFloat(2, 0, 100), // Humidade entre 0% e 100%
            'timestmp' => $this->faker->dateTimeThisYear(), // Data e hora do timestamp no ano atual
            'kits_id' => $kit->id, // A associar o Kit ID criado ao KitReading
        ];
    }
}