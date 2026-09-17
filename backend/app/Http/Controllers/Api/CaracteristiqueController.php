<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CaracteristiqueRequest;
use App\Models\Caracteristique;
use Illuminate\Http\Request;

class CaracteristiqueController extends Controller
{
    // جلب كل الخصائص (اختياري إيلا بغيتيه)
    public function index()
    {
        $caracteristiques = Caracteristique::all();
        return response()->json($caracteristiques);
    }

    public function getByAuberge($aubergeId)
{
    $caracteristiques = Caracteristique::where('auberge_id', $aubergeId)->get();
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

    public function update(CaracteristiqueRequest $request, $id)
    {
        $caracteristique = Caracteristique::findOrFail($id);
        $caracteristique->update($request->validated());

        return response()->json([
            'message' => 'Caractéristique mise à jour avec succès',
            'caracteristique' => $caracteristique
        ]);
    }

  public function destroy($id)
{
    $caracteristique = Caracteristique::findOrFail($id);

    $caracteristique->chambres()->detach();

    $caracteristique->delete();

    return response()->json(['message' => 'Caractéristique supprimée avec succès']);
}
}
