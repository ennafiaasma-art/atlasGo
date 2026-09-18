<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFavoriteRequest;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = $request->user()->favoriteDestinations;

        return response()->json([
            'status' => 'success',
            'data' => $favorites
        ]);
    }

    public function store(StoreFavoriteRequest $request)
    {
        $userId = $request->user()->id;
        $destinationId = $request->destination_id;

        $favorite = Favorite::where('user_id', $userId)
                            ->where('destination_id', $destinationId)
                            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Destination retirée des favoris avec succès.'
            ]);
        } else {
            Favorite::create([
                'user_id' => $userId,
                'destination_id' => $destinationId
            ]);
            return response()->json([
                'status' => 'success',
                'message' => 'Destination ajoutée aux favoris avec succès.'
            ], 201);
        }
    }
}
