<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChambreRequest;
use App\Models\Chambre;
use Illuminate\Http\Request;

class ChambreController extends Controller
{
    public function index($aubergeId)
    {
        $chambres = Chambre::where('auberge_id', $aubergeId)->with('caracteristique')->get();
        return response()->json($chambres);
    }

  public function store(ChambreRequest $request)
    {
        try {
            $chambre = Chambre::create($request->validated());

            return response()->json([
                'message' => 'Chambre créée avec succès',
                'chambre' => $chambre
            ], 201);

        } catch (\Exception $e) {
            // هاد السطر غادي يرجع ليك الخطأ الحقيقي بالتفصيل للواجهة عوض 500 مبهمة
            return response()->json([
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $chambre = Chambre::findOrFail($id);
        $chambre->delete();

        return response()->json(['message' => 'Chambre supprimée avec succès']);
    }
}
