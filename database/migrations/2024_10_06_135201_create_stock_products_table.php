<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('stock_products', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('threshold')->default(20);
            $table->integer('stock');
            $table->text('name');
            $table->text('scientific_name')->nullable();
            $table->decimal('price', 10, 2);
            $table->bigInteger('categories_id')->unsigned();
            $table->longText('imagem')->nullable();
            $table->boolean('isKit')->default(false);
            $table->longText('description')->nullable();
            $table->string('size')->nullable();
            $table->timestamps();

            $table->foreign('categories_id')->references('id')->on('categories')->onDelete('cascade');
            $table->index('isKit');
        });
    }

    public function down()
    {
        Schema::dropIfExists('stock_products');
    }
};
