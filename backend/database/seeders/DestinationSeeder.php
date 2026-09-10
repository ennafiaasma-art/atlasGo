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
        DB::table('destinations')->insert([

        'nom'=>'lksiba',
     'description'=>'nature',
     'ville'=>'beni mella',
     'image'=>'image kasba'
        ]);


        Destination ::create([

        'nom'=>'lwdaya',
     'description'=>'toristique',
     'ville'=>'marrakech',
     'image'=>'image lawdaya'
        ]);
    }
    }
