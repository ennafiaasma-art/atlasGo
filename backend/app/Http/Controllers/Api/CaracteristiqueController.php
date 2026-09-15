<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CaracteristiqueRequest; // 👈 استدعاء الـ Request الجديد
use App\Models\Caracteristique;

class CaracteristiqueController extends Controller
{
    public function index()
    {
        $caracteristiques = Caracteristique::all();
        return response()->json($caracteristiques);
    }

    public function store(CaracteristiqueRequest $request)
    {
        $caracteristique = Caracteristique::create($request->validated());

        return response()->json([
            'message' => 'Caractéristique créée avec succès',
            'caracteristique' => $caracteristique
        ], 201);
    }
}
