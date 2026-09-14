<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auberge;
use App\Http\Requests\AubergeRequest;

class AubergeController extends Controller
{
    public function index()
    {
    return response()->json(Auberge::with('destination')->get(), 200);
    }


    public function store(AubergeRequest $request)
    {
     $auberge = Auberge::create($request->validated());
        return response()->json($auberge, 201);
    }

    public function show( $id)
    {return response()->json(Auberge::with('destination')->findOrFail($id), 200);
    }


    public function update(AubergeRequestt $request, $id)
    {
   $auberge = Auberge::findOrFail($id);
        $auberge->update($request->validated());
        return response()->json($auberge, 200);
    }


    public function destroy( $id)
    {
     Auberge::destroy($id);
        return response()->json(['message' => 'Auberge supprimée'], 200);
    }
}
