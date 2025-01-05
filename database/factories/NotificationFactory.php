<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition()
    {
        return [
            'message' => $this->faker->sentence(), // Mensagem aleatória
            'type' => $this->faker->randomElement(['info', 'warning', 'error', 'success']), // Tipo da notificação
            'is_read' => $this->faker->boolean(), // Define se está lida
            'users_id' => User::factory(),
            'admin' => $this->faker->boolean(10), // 10% de chance de ser uma notificação de admin
        ];
    }
}
