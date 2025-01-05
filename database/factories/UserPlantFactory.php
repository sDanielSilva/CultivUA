<?php

namespace Database\Factories;

use App\Models\UserPlant;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Plant;

class UserPlantFactory extends Factory
{
    protected $model = UserPlant::class;

    public function definition()
    {
        return [
            'users_id' => User::factory(),
            'plants_id' => Plant::factory(),
            'created_at' => $this->faker->dateTimeBetween('2024-11-01', '2024-12-31'), // Definindo data entre 1º de novembro e 31 de dezembro de 2024
            'updated_at' => $this->faker->dateTimeBetween('2024-11-01', '2024-12-31'),
        ];
    }
}

