<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'chambre_id' => 'required|exists:chambres,id',
            'date_debut'  => 'required|date|after_or_equal:today',
            'date_fin'    => 'required|date|after:date_debut',
            'nb_personne' => 'nullable|integer|min:1',
            'statut'      => 'nullable|string|in:en_attente,confirmee,refusee,annulee',
        ];
    }
}
