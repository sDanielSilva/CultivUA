<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('kits', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('codigo', 6)->unique();
            $table->string('name')->nullable();
            $table->boolean('isAssociated')->default(false);
            $table->timestamps();

            $table->index('codigo');
        });
    }

    public function down()
    {
        Schema::dropIfExists('kits');
    }
};
