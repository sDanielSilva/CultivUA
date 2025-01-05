<?php

namespace Database\Factories;

use App\Models\Kit;
use Illuminate\Database\Eloquent\Factories\Factory;

class KitFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Kit::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'codigo' => $this->faker->unique()->regexify('[A-Za-z0-9]{6}'), // Gera um código único de 6 caracteres alfanuméricos
            'name' => $this->faker->word(), // Gera um nome aleatório
            'isAssociated' => $this->faker->boolean(30), // 30% de chance de ser associado
        ];
    }
}
