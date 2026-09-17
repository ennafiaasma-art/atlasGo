<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('chambres', function (Blueprint $table) {
            if (Schema::hasColumn('chambres', 'caracteristique_id')) {
                $table->dropForeign(['caracteristique_id']);

                $table->dropColumn('caracteristique_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('chambres', function (Blueprint $table) {
            $table->unsignedBigInteger('caracteristique_id')->nullable();
        });
    }
};
