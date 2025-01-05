<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('kit_readings', function (Blueprint $table) {
            $table->id()->index();
            $table->float('temperatura');
            $table->float('luz');
            $table->float('humidade');
            $table->timestamp('timestmp')->index()->useCurrent();
            $table->foreignId('kits_id')->constrained('kits')->onDelete('cascade');
            $table->timestamps();
        });
    }

};
