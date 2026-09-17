<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chambre;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ChambreController extends Controller
{
    public function index($aubergeId)
    {
        $chambres = Chambre::where('auberge_id', $aubergeId)->with('caracteristiques')->get();
        return response()->json($chambres);
    }

    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'numero' => [
                    'required',
                    'string',
                    Rule::unique('chambres')->where(function ($query) use ($request) {
                        return $query->where('auberge_id', $request->auberge_id);
                    }),
                ],
                'type' => 'required|string',
                'prix' => 'required|numeric|min:1', // منع أن الثمن يكون 0 أو أقل
                'auberge_id' => 'required|exists:auberges,id',
                'caracteristique_ids' => 'nullable|array',
                'caracteristique_ids.*' => 'exists:caracteristiques,id'
            ]);

            $caracteristiqueIds = $validatedData['caracteristique_ids'] ?? [];
            unset($validatedData['caracteristique_ids']);

            $chambre = Chambre::create($validatedData);

            if (!empty($caracteristiqueIds)) {
                $chambre->caracteristiques()->attach($caracteristiqueIds);
            }

            $chambre->load('caracteristiques');

            return response()->json([
                'message' => 'Chambre créée avec succès',
                'chambre' => $chambre
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => collect($e->errors())->flatten()->first(),
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $chambre = Chambre::findOrFail($id);
            $chambre->delete();

            return response()->json(['message' => 'Chambre supprimée avec succès']);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erreur lors de la suppression de la chambre'
            ], 500);
        }
    }
}
