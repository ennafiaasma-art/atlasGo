<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategorieRequest;
use App\Models\Categorie;

class CategorieController extends Controller
{
   public function index()
{
    $categories = Categorie::with('destination')->get();
    return response()->json($categories);
}

    public function store(CategorieRequest $request)
    {
        $categorie = Categorie::create($request->validated());

        return response()->json([
            'message' => 'Catégorie créée avec succès',
            'categorie' => $categorie
        ], 201);
    }

 

    public function destroy($id)
    {
        $categorie = Categorie::findOrFail($id);
        $categorie->delete();

        return response()->json(['message' => 'Catégorie supprimée avec succès']);
    }
}
