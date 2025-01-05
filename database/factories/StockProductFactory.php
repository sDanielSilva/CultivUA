<?php

namespace Database\Factories;

use App\Models\StockProduct;
use App\Models\Category; // Para associar a uma categoria
use Illuminate\Database\Eloquent\Factories\Factory;

class StockProductFactory extends Factory
{
    /**
     * O nome do modelo correspondente.
     *
     * @var string
     */
    protected $model = StockProduct::class;

    /**
     * Define o estado padrão do modelo.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'threshold' => $this->faker->numberBetween(1, 20), // Limite de estoque
            'stock' => $this->faker->numberBetween(50, 500), // Quantidade no estoque
            'id' => $this->faker->unique()->randomNumber(), // ID único do produto
            'name' => $this->faker->word(), // Nome do produto
            'price' => $this->faker->randomFloat(2, 5, 500), // Preço com ponto decimal
            'categories_id' => Category::factory(), // Associar automaticamente a uma categoria
            'updated_at' => now(), // Data de atualização
            'created_at' => now(), // Data de criação
        ];
    }
}