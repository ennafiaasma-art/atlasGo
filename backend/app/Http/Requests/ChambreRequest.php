<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ChambreRequest extends FormRequest
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
            'numero' => 'required|string|max:50',
            'type' => 'required|string|max:100',
            'prix' => 'required|numeric|min:1',
            'auberge_id' => 'required|exists:auberges,id',
            'caracteristique_id' => 'nullable|exists:caracteristiques,id',
        ];
    }
}
