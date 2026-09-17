<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 1. أولاً نحيدو الـ Foreign Key والجدول الوسيط اللي لامسيه باش ميبقاوش يمنعو الحذف
        if (Schema::hasTable('chambre_caracteristique')) {
            Schema::dropIfExists('chambre_caracteristique');
        }

        // 2. إذا كان جدول caracteristiques كاين، نحيدوه بطريقة آمنة
        if (Schema::hasTable('caracteristiques')) {
            Schema::drop('caracteristiques');
        }

        // 3. دابا نعاودو ننشئوه نقي بالشكل الصحيح
        Schema::create('caracteristiques', function (Blueprint $table) {
            $table->id();
            $table->foreignId('auberge_id')->constrained()->onDelete('cascade');
            $table->string('nom');
            $table->timestamps();
        });

        // 4. نعاودو نشئوا جدول الوسيط (Many-to-Many) بين الغرف والخصائص
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
