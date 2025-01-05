<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersPlantsTable extends Migration
{
    public function up()
    {
        Schema::create('users_plants', function (Blueprint $table) {
            $table->bigIncrements('id'); // ID único para a tabela
            $table->unsignedBigInteger('users_id'); // FK para users
            $table->unsignedBigInteger('plants_id'); // FK para plantas
            $table->unsignedBigInteger('location_id')->nullable(); // FK para localização
            $table->text('name')->nullable(); // Nome da planta
            $table->longText('image')->nullable(); // Caminho da imagem da planta
            $table->timestamps(); // Timestamps (created_at e updated_at)

            // Relacionamentos e restrições
            $table->foreign('users_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('plants_id')->references('id')->on('plants')->onDelete('cascade');
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users_plants');
    }
}
