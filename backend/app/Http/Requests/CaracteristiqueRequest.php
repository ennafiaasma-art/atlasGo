<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CaracteristiqueRequest extends FormRequest
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
            'vue' => 'nullable|string|max:100',
            'wifi' => 'nullable|boolean',
            'etage' => 'nullable|integer',
            'climatisation' => 'nullable|boolean',
            'tv' => 'nullable|boolean',
        ];
    }
}
