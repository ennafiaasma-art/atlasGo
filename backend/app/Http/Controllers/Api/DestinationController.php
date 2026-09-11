<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Destination;
use App\Http\Requests\DestinationRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DestinationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Destination::with(['activites', 'auberges'])->get(), 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DestinationRequest $request)
    {
        $data = $request->validated();

        // معالجة رفع الصورة عند الإضافة
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('destinations', 'public');
            $data['image'] = $path;
        }

        $destination = Destination::create($data);

        return response()->json($destination, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return response()->json(Destination::with(['activites', 'auberges'])->findOrFail($id), 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DestinationRequest $request, $id)
    {
        $destination = Destination::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($destination->image) {
                Storage::disk('public')->delete($destination->image);
            }
            $path = $request->file('image')->store('destinations', 'public');
            $data['image'] = $path;
        } else {
            unset($data['image']);
        }

        $destination->update($data);

        return response()->json($destination, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);

        if ($destination->image) {
            Storage::disk('public')->delete($destination->image);
        }

        $destination->delete();

        return response()->json(['message' => 'Destination supprimée avec succès'], 200);
    }

    public function rechercheDestinationParVille(Request $request)
    {
        $ville = $request->query('ville');
        $category = $request->query('category');

        $destinations = Destination::when($ville, function ($query) use ($ville) {
            return $query->where('ville', 'LIKE', '%' . $ville . '%');
        })
        ->when($category, function ($query) use ($category) {
            return $query->where('category', 'LIKE', '%' . $category . '%'); // تصحيح خطأ إملائي caterory -> category
        })
        ->get();

        return response()->json($destinations, 200);
    }
}
