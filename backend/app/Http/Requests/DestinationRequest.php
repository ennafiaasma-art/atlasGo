<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DestinationRequest extends FormRequest
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
$destinationParam = $this->route('destination');
$destinationId = is_object($destinationParam) ? $destinationParam->id : $destinationParam;
        return [
            'nom' => 'required|string|max:255|unique:destinations,nom,' . $destinationId,
            'description' => 'nullable|string',
            'ville' => 'required|string|max:255',
            'province' => 'required|string|max:255',

            'image' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
        ];
    }
}
