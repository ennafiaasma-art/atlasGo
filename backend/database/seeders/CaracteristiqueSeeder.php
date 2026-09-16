<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CaracteristiqueSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('caracteristiques')->insert([
            [
                'wifi' => true,
                'climatisation' => true,
                'tv' => true,
                'vue' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ],
        ]);
    }
}
