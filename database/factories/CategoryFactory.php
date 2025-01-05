<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    /**
     * O nome do modelo correspondente.
     *
     * @var string
     */
    protected $model = Category::class;

    /**
     * Define o estado padrão do modelo.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' =>$this->faker->unique()->word(), // Nome fictício da categoria
            'mostrarLoja' => $this->faker->boolean(80), // 80% de chance de ser true
            'mostrarBlog' => $this->faker->boolean(50), // 50% de chance de ser true
        ];
    }
}