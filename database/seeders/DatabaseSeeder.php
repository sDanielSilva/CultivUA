<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Kit;
use App\Models\Plant;
use App\Models\Order;
use App\Models\Notification;
use App\Models\Admin;
use App\Models\Sensor;
use App\Models\SensorReading;
use App\Models\Location;
use App\Models\StockProduct;
use App\Models\OrderItem;
use App\Models\Category;
use App\Models\UserPlant;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Criar users
        //User::factory(5)->create();
       // User::factory(5)->create();

        // Criar administradores
        //Admin::factory(5)->create();
       // // Criar administradores
       // Admin::factory(5)->create();

        // Criar plantas
        //Plant::factory(5)->create();
       // Plant::factory(5)->create();

        // Criar sensores
        //Sensor::factory(5)->create();
       // Sensor::factory(5)->create();

        // Criar leituras de sensores
        //SensorReading::factory(5)->create();
        //SensorReading::factory(5)->create();

        // Criar pedidos
        //Category::factory()->count(5)->create();
        //StockProduct::factory()->count(5)->create();
        //OrderItem::factory()->count(15)->create();
        //UserPlant::factory()->count(10)->create();
        //Order::factory(5)->create();



        //Order::factory(5)->create();

        // Criar notificações
        //Notification::factory(5)->create();
       //Notification::factory(5)->create();

       //$this->call(KitSeeder::class);

        Location::factory()->count(10)->create();
    }
}
