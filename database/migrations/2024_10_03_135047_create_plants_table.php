<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlantsTable extends Migration
{
    public function up()
    {
        Schema::create('plants', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('image')->nullable();
            $table->text('name');
            $table->text('species')->nullable();
            $table->text('description')->nullable();
            $table->float('ideal_temperature', 2)->nullable();
            $table->float('ideal_humidity', 2)->nullable();
            $table->float('ideal_light')->nullable();
            $table->float('buffer_percentage', 2)->default(20);
            $table->string('watering_frequency')->nullable();
            $table->string('origin')->nullable();
            $table->float('min_dimension', 2)->nullable(); // min_dimension
            $table->float('max_dimension', 2)->nullable(); //
            $table->string('cycle')->nullable();
            $table->string('pruning_months')->nullable(); // pruning_months
            $table->string('maintenance')->nullable(); // maintenance
            $table->string('growth_rate')->nullable();
            $table->boolean('indoor')->nullable();
            $table->boolean('flower')->nullable();
            $table->boolean('fruit')->nullable();
            $table->boolean('edible_fruit')->nullable();
            $table->boolean('edible_leaves')->nullable();
            $table->boolean('medicinal')->nullable();
            $table->boolean('cuisine')->nullable();
            $table->boolean('poisonous_to_pets')->nullable();
            $table->boolean('poisonous_to_humans')->nullable();
            $table->string('harvest_season')->nullable();
            $table->text('watering_guide')->nullable(); // Guia de rega
            $table->text('pruning_guide')->nullable(); // Guia de poda
            $table->text('sunlight_guide')->nullable(); // Guia de luz solar
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('plants');
    }
}
