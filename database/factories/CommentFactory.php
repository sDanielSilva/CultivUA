<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\User;
use App\Models\BlogPost;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Comment::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(), // Cria um user associado automaticamente
            'post_id' => BlogPost::factory(), // Cria um post associado automaticamente
            'comment_text' => $this->faker->paragraph(2, true),
            'commented_at' => $this->faker->dateTimeThisYear(),
            'isVisible' => false
        ];
    }
}
