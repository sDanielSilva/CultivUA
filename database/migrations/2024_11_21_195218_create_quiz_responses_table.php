<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('quiz_responses', function (Blueprint $table) {
            $table->id();
            $table->string('question');   // Pergunta do quiz
            $table->string('answer');     // Resposta do utilizador
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('quiz_responses');
    }
};
