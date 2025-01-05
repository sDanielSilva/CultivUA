<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition()
    {
        return [
            'users_id' => User::factory(),
            'status' => $this->faker->randomElement(['pending', 'completed', 'cancelled']),
            'total_amount' => $this->faker->randomFloat(2, 10, 100), // Valor entre 10 e 100
            'created_at' => $this->faker->dateTimeBetween('2024-11-01', '2024-12-31'),
            'updated_at' => now(),
        ];
    }
}
