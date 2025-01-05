<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id')->index();
            $table->string('username', 100)->unique();
            $table->text('password');
            $table->string('email', 100)->unique()->index();
            $table->longText('imagem')->nullable();
            $table->boolean('newsletter')->default(0);

            $table->timestamps();
        });
    }



    public function down()
    {
        Schema::dropIfExists('users');
    }
}
