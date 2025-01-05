<?php

namespace Database\Factories;

use App\Models\BlogPost;
use App\Models\Admin;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class BlogPostFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BlogPost::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'title' => $this->faker->sentence(6, true),
            'content' => $this->faker->paragraphs(3, true),
            'status' => $this->faker->randomElement(['draft', 'published', 'archived']),
            'is_highlighted' => $this->faker->boolean(20), // 20% chance de ser destacado
            'admins_id' => Admin::factory(), // Cria um admin associado
            'image' => $this->faker->optional()->imageUrl(640, 480, 'blog', true),
            'reading_time' => $this->faker->numberBetween(1, 20), // Minutos de leitura
            'categoria_id' => $this->faker->optional()->randomElement(Category::pluck('id')->toArray()),
        ];
    }
}
