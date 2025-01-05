<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->text('title');
            $table->text('content');
            $table->text('status');
            $table->boolean('is_highlighted')->default(false);
            $table->bigInteger('admins_id')->unsigned();
            $table->longText('image')->nullable();
            $table->integer('reading_time')->unsigned()->default(0);
            $table->unsignedBigInteger('categoria_id')->nullable();
            $table->timestamps();


            $table->foreign('categoria_id')
                ->references('id')
                ->on('categories')
                ->onDelete('set null');
            $table->foreign('admins_id')->references('id')->on('admins')->onDelete('cascade');
        });

    }

    public function down()
    {
        Schema::dropIfExists('blog_posts');
    }
};
