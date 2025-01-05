<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plants_kits', function (Blueprint $table) {
            $table->id(); // Primary Key
            $table->unsignedBigInteger('user_plant_id')->index();
            $table->unsignedBigInteger('kits_id')->index();

            // Foreign keys
            $table->foreign('user_plant_id')->references('id')->on('users_plants')->onDelete('cascade');
            $table->foreign('kits_id')->references('id')->on('kits')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('plants_kits');
    }
};
