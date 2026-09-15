<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Caracteristique;
use Illuminate\Http\Request;

class CaracteristiqueController extends Controller
{
    // جلب كل الخصائص المتاحة (باش الأدمين يختار منهم في Select)
    public function index()
    {
        $caracteristiques = Caracteristique::all();
        return response()->json($caracteristiques);
    }

    // إضافة خصيصة جديدة (اختياري إيلا بغيت تزيدها من لوحة التحكم)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'vue' => 'nullable|string|max:100',
            'wifi' => 'nullable|boolean',
            'etage' => 'nullable|integer',
            'climatisation' => 'nullable|boolean',
            'tv' => 'nullable|boolean',
        ]);

        $caracteristique = Caracteristique::create($validated);

        return response()->json([
            'message' => 'Caractéristique créée avec succès',
            'caracteristique' => $caracteristique
        ], 201);
    }
}
