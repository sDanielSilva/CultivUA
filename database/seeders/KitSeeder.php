<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Kit;
use App\Models\Location;

class KitSeeder extends Seeder
{
    public function run()
    {
        // Garante de que a tabela 'locations' tenha alguns registros
        $locations = Location::all();

        if ($locations->isEmpty()) {
            $this->command->warn('No locations found. Seeding some locations first.');
            $locations = Location::factory()->count(5)->create();
        }

        foreach ($locations as $location) {
            Kit::create([
                'name' => 'Kit for ' . $location->name,
                'locations_id' => $location->id,
                'isAssociated' => false, // Você pode alternar entre true/false
            ]);
        }
    }
}
