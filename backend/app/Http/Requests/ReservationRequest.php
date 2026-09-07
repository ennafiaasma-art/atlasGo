<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'auberge_id'  => 'required|exists:auberges,id',
            'date_debut'  => 'required|date|after_or_equal:today',
            'date_fin'    => 'required|date|after:date_debut',
            'nb_personne' => 'required|integer|min:1',
        ];
    }
}
