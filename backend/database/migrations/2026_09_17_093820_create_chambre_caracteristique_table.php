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
        Schema::create('chambre_caracteristique', function (Blueprint $table) {
           $table->id();
            $table->foreignId('chambre_id')->constrained()->onDelete('cascade');
            $table->foreignId('caracteristique_id')->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chambre_caracteristique');

        Schema::table('chambres', function (Blueprint $table) {
            $table->unsignedBigInteger('caracteristique_id')->nullable();
        });

        }
};
