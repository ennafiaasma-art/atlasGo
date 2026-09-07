<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Http\Requests\DestinationRequest;
class DestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Destination::with(['activites', 'auberges'])->get(),200);
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DestinationRequest $request)
    {
        $destination=Destination::create($request->validated());
        return response()->json($destination,201);

        //
    }

    /**
     * Display the specified resource.
     */
    public function show( $id)
    {
        return response()->json(Destination::with(['activites' , 'auberges'])->findOrFail($id) ,200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DestinationRequest $request,  $id)
    {
        $destination=Destination::findOrFail($id);
        $destination->update($request->validated());
        return response()->json($destination,200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy( $id)
    {
        Destination::destroy($id);
        return response()->json(['message '=>'Dsetination supprimée'] , 200);
    }
}
