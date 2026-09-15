<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class AubergeRequest extends FormRequest
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
           'nom' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'ville' => 'nullable|string|max:255',
            'prix' => 'nullable|numeric',
            'description' => 'nullable|string',
            'telephone' => 'nullable|string|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'destination_id' => 'required|exists:destinations,id',
        ];
    }
}

