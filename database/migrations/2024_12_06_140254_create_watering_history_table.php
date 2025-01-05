<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('watering_history', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('users_plants_id'); // Relaciona com a tabela users_plants
            $table->enum('watering_type', ['manual', 'automatic'])->default('manual'); // Tipo de rega
            $table->timestamp('created_at')->useCurrent(); // Data/hora da rega
            $table->foreign('users_plants_id')->references('id')->on('users_plants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('watering_history');
    }
};
