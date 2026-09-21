<?php



namespace App\Http\Controllers\Api;



use App\Http\Controllers\Controller;

use App\Http\Requests\ChambreRequest;
use App\Models\Auberge;
use App\Models\Chambre;

use App\Http\Requests\AubergeRequest;

use Illuminate\Support\Facades\Storage;



class AubergeController extends Controller

{

   public function index()

    {

        $auberges = Auberge::with('destination')->withCount('chambres')->latest()->get();



        return response()->json([

            'auberges' => $auberges

        ], 200);

    }



    public function store(AubergeRequest $request)

    {

     $data = $request->validated();



        if ($request->hasFile('image')) {

            $data['image'] = $request->file('image')->store('auberges', 'public');

        }

        $auberge = Auberge::create($data);

        $auberge->loadCount('chambres');



        return response()->json([

            'message' => 'Auberge créée avec succès',

            'auberge' => $auberge

        ], 201);

    }



   public function show($id)

    {

        $auberge = Auberge::with(['destination', 'chambres'])->findOrFail($id);



        return response()->json([

            'auberge' => $auberge

        ], 200);

    }





    public function update(AubergeRequest $request, $id)

    {

   $auberge = Auberge::findOrFail($id);

        $data = $request->validated();



        if ($request->hasFile('image')) {

            if ($auberge->image) {

                Storage::disk('public')->delete($auberge->image);

            }

            $data['image'] = $request->file('image')->store('auberges', 'public');

        }

        $auberge->update($data);

        $auberge->loadCount('chambres');



        return response()->json([

            'message' => 'Auberge mise à jour avec succès',

            'auberge' => $auberge

        ], 200);

    }





    public function destroy( $id)

    {

$auberge = Auberge::findOrFail($id);



        if ($auberge->image) {

            Storage::disk('public')->delete($auberge->image);

        }



        $auberge->delete();

        return response()->json([

            'message' => 'Auberge supprimée avec succès'

        ], 200);

            }

            public function getAvailableChambres($id)
    {
        $auberge = Auberge::findOrFail($id);

        $chambres = $auberge->chambres()->where('statut', 'disponible')->get();

        return response()->json([
            'chambres' => $chambres
        ], 200);
    }






public function getChambresDisponibles(ChambreRequest $request, $aubergeId)
{
    $chambres = Chambre::where('auberge_id', $aubergeId)
        ->whereDoesntHave('reservations', function ($query) use ($request) {
            if ($request->has(['date_debut', 'date_fin'])) {
                $query->where(function ($q) use ($request) {
                    $q->whereBetween('date_debut', [$request->date_debut, $request->date_fin])
                      ->orWhereBetween('date_fin', [$request->date_debut, $request->date_fin])
                      ->orWhere(function ($sub) use ($request) {
                          $sub->where('date_debut', '<=', $request->date_debut)
                              ->where('date_fin', '>=', $request->date_fin);
                      });
                });
            } else {
                $query->where('date_fin', '>=', now());
            }
        })
        ->get();

    return response()->json([
        'success' => true,
        'chambres' => $chambres
    ]);
}

}
