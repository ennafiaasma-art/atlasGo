<?php

namespace Database\Seeders;
use App\Models\Destination ;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DestinationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
      Destination::create([
    'nom' => 'lksiba',
    'description' => 'nature',
    'ville' => 'beni mellal',
    'province' => 'Béni Mellal', 
    'image' => 'image kasba',
]);



    }
    }
