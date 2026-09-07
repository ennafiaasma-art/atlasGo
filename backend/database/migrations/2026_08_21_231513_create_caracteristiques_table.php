<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('caracteristiques', function (Blueprint $table) {
            $table->id();
            $table->boolean('vue')->default(false);
        $table->boolean('wifi')->default(false);
        $table->integer('etage')->default(0);
        $table->boolean('climatisation')->default(false);
        $table->boolean('tv')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('caracteristiques');
    }
};
