<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use App\Models\Chambre;
use App\Enums\ReservationStatus;
use App\Http\Requests\ReservationRequest;
use App\Http\Requests\UpdateReservationStatusRequest;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin') {
            $reservations = Reservation::with(['user', 'chambre.auberge'])->get();
        } else {
            $reservations = Reservation::with(['chambre.auberge'])
                ->where('user_id', $user->id)
                ->get();
        }

        return response()->json($reservations, 200);
    }

    public function store(ReservationRequest $request)
    {
        $reservation = Reservation::create([
            'user_id' => auth()->id(),
            'chambre_id' => $request->chambre_id,
            'date_debut' => $request->date_debut,
            'date_fin' => $request->date_fin,
            'nb_personne' => $request->nb_personne,
            'statut' => ReservationStatus::PENDING->value,
        ]);

        $chambre = Chambre::find($request->chambre_id);
        if ($chambre) {
            $chambre->update([
                'statut' => 'occupee',
            ]);
        }

        return response()->json([
            'message' => 'Réservation réussie !',
            'reservation' => $reservation
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $user = $request->user();
        $reservation = Reservation::with(['user', 'chambre.auberge'])->findOrFail($id);

        if ($user->role !== 'admin' && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        return response()->json($reservation, 200);
    }

    public function update(ReservationRequest $request, $id)
    {
        $user = $request->user();
        $reservation = Reservation::findOrFail($id);

        if ($user->role !== 'admin' && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $reservation->update([
            'chambre_id' => $request->chambre_id,
            'date_debut' => $request->date_debut,
            'date_fin'   => $request->date_fin,
            'nb_personne' => $request->nb_personne ?? $reservation->nb_personne,
        ]);

        return response()->json([
            'message' => 'Réservation modifiée avec succès.',
            'reservation' => $reservation->load('chambre.auberge')
        ], 200);
    }

    public function cancel(Request $request, $id)
    {
        $reservation = Reservation::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $reservation->update(['statut' => ReservationStatus::CANCELLED->value]);

        if ($reservation->chambre_id) {
            $chambre = Chambre::find($reservation->chambre_id);
            if ($chambre) {
                $chambre->update(['statut' => 'disponible']);
            }
        }

        return response()->json([
            'message'     => 'Réservation annulée avec succès.',
            'reservation' => $reservation
        ], 200);
    }

    public function updateStatus(UpdateReservationStatusRequest $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update($request->validated());

        if (isset($request->statut) && $request->statut === ReservationStatus::CANCELLED->value) {
            $chambre = Chambre::find($reservation->chambre_id);
            if ($chambre) {
                $chambre->update(['statut' => 'disponible']);
            }
        }

        return response()->json([
            'message'     => 'Statut de réservation mis à jour.',
            'reservation' => $reservation
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $reservation = Reservation::findOrFail($id);

        if ($user->role !== 'admin' && $reservation->user_id !== $user->id) {
            return response()->json(['message' => 'Accès non autorisé.'], 403);
        }

        $chambreId = $reservation->chambre_id;

        $reservation->delete();

        if ($chambreId) {
            $chambre = Chambre::find($chambreId);
            if ($chambre) {
                $chambre->update(['statut' => 'disponible']);
            }
        }

        return response()->json(['message' => 'Réservation supprimée définitivement.'], 200);
    }
}
