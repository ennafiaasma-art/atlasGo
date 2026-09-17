<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Caracteristique;
use App\Models\Auberge;

class CaracteristiqueSeeder extends Seeder
{
    public function run(): void
    {
        // جلب أول أوبيرج كمثال (أو التأكد من وجود أوبيرج)
        $auberge = Auberge::first();

        if ($auberge) {
            $caracteristiques = [
                'Wifi gratuit',
                'Climatisation',
                'Télévision',
                'Vue sur montagne'
            ];

            foreach ($caracteristiques as $carac) {
                Caracteristique::create([
                    'auberge_id' => $auberge->id,
                    'nom' => $carac
                ]);
            }
        }
    }
}
