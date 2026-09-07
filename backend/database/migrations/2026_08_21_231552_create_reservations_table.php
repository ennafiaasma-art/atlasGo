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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->date('date_debut');
        $table->date('date_fin')->nullable();
        $table->integer('nb_personne')->default(1);
        $table->string('statut')->default('en_attente');
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        $table->foreignId('activite_id')->nullable()->constrained('activites')->onDelete('cascade');
        $table->foreignId('chambre_id')->nullable()->constrained('chambres')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
