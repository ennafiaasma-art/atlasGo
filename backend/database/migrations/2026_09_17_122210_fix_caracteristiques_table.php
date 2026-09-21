<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        if (Schema::hasTable('chambre_caracteristique')) {
            Schema::dropIfExists('chambre_caracteristique');
        }

        if (Schema::hasTable('caracteristiques')) {
            Schema::drop('caracteristiques');
        }

        Schema::create('caracteristiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auberge_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->timestamps();
        });

        if (!Schema::hasTable('chambre_caracteristique')) {
            Schema::create('chambre_caracteristique', function (Blueprint $table) {
                $table->id();
                $table->foreignId('chambre_id')->constrained()->onDelete('cascade');
                $table->foreignId('caracteristique_id')->constrained()->onDelete('cascade');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('chambre_caracteristique');
        Schema::dropIfExists('caracteristiques');
    }
};
