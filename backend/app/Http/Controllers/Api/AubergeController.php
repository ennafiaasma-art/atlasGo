<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Auberge;
use App\Http\Requests\AubergeRequest;

class AubergeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
    return response()->json(Auberge::with('destination')->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AubergeRequest $request)
    {
     $auberge = Auberge::create($request->validated());
        return response()->json($auberge, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show( $id)
    {return response()->json(Auberge::with('destination')->findOrFail($id), 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(AubergeRequestt $request, $id)
    {
   $auberge = Auberge::findOrFail($id);
        $auberge->update($request->validated());
        return response()->json($auberge, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
     Auberge::destroy($id);
        return response()->json(['message' => 'Auberge supprimée'], 200);
    }
}
