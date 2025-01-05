<?php

namespace Database\Factories;

use App\Models\SupportTicket;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;


class SupportTicketFactory extends Factory
{ /**
    * The name of the factory's corresponding model.
    *
    * @var string
    */
   protected $model = SupportTicket::class;

   /**
    * Define the model's default state.
    *
    * @return array
    */
   public function definition()
   {
       return [
           'user_id' => User::factory(), // Cria um user associado automaticamente
           'email' => $this->faker->safeEmail,
           'subject' => $this->faker->sentence(6, true),
           'message' => $this->faker->paragraph(3, true),
           'response' => $this->faker->optional()->paragraph(2, true),
           'status' => $this->faker->randomElement(['open', 'closed']),
       ];
   }
}