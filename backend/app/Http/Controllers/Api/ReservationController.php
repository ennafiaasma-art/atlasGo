<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Enums\ReservationStatus;
use App\Enums\UserRole;
use App\Http\Requests\ReservationRequest;
use App\Http\Requests\UpdateReservationStatusRequest;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user=$request->user();
        if($user->role === 'admin'){
            $reservation=Reservation::with(['user' , 'auberge'])->get();
        } else{
            $reservation=Reservation::with(['auberge'])
            ->where('user-id' , $user->id)->get();
        }
        return response()->json($reservation , 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ReservationRequest $request)
    {

        $reservation = Reservation::create([
            'user_id'    => $request->user()->id,
            'auberge_id' => $request->auberge_id,
            'date_debut' => $request->date_debut,
            'date_fin'   => $request->date_fin,
            'status'     => ReservationStatus::PENDING,

        ]);
        return response()->json($reservation->load('auberge'),201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $id)
    {
        $user=$request->user();
        $rservation=Reservation::with(['user','auberge'])->findOrFail($id);
        if($user->role !== 'admin' && $rservation->user_id !==$user->id){
            return response()->json(['message'=>'access non autorise'],403);
        }
        return response()->json($rservation, 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ReservationRequest $request,  $id)
    {
        $user=$request->user();
        $reservation=Reservation::findOrFail($id);

        if($user->role !== 'admin' && $reservation->user_id !== $user->id){
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }
        $reservation->update([
            'auberge_id' => $request->auberge_id,
            'date_debut' => $request->date_debut,
            'date_fin'   => $request->date_fin,
        ]);
        return response()->json([
            'message' => 'Réservation modifiée avec succès.',
            'reservation' => $reservation->load('auberge')
        ], 200);
    }

//  annuler reservation

    public function cancel(Request $request, $id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $reservation->update(['status' => ReservationStatus::CANCELLED]);

        return response()->json([
            'message'     => 'Réservation annulée avec succès.',
            'reservation' => $reservation
        ], 200);
    }

    // changer le status de reservation
    public function updateStatus(UpdateReservationStatusRequest $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->validated());

        return response()->json([
            'message'     => 'Statut de réservation mis à jour.',
            'reservation' => $reservation
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
  public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $reservation = Reservation::findOrFail($id);

        if ($user->role !== 'admin' && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée définitivement.'], 200);
    }
}
