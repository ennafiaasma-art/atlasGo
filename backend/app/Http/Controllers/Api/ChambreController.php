<?php

namespace App\Http\Controllers\Api;

use  App\Http\Controllers\Controller;
use App\Models\Chambre;
use Illuminate\Http\Request;

class ChambreController extends Controller
{
    public function index($aubergeId)
    {
        $chambres = Chambre::where('auberge_id', $aubergeId)->with('caracteristique')->get();
        return response()->json($chambres);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'numero' => 'required|string|max:50',
            'type' => 'required|string|max:100',
            'prix' => 'required|numeric|min:0',
            'auberge_id' => 'required|exists:auberges,id',
            'caracteristique_id' => 'nullable|exists:caracteristiques,id',
        ]);

        $chambre = Chambre::create($validated);

        return response()->json([
            'message' => 'Chambre créée avec succès',
            'chambre' => $chambre
        ], 201);
    }


    public function destroy($id)
    {
        $chambre = Chambre::findOrFail($id);
        $chambre->delete();

        return response()->json(['message' => 'Chambre supprimée avec succès']);
    }
}
