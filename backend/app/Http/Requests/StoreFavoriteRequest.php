<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreFavoriteRequest extends FormRequest
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
            'destination_id' => 'required|integer|exists:destinations,id',
        ];
    }
    public function messages(): array
    {
        return [
            'destination_id.required' => 'L\'identifiant de la destination est requis.',
            'destination_id.integer' => 'L\'identifiant de la destination doit être un nombre entier.',
            'destination_id.exists' => 'Cette destination n\'existe pas dans le système.',
        ];
    }
}
