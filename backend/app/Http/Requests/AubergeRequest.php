<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
        $aubergeId = $this->route('auberge')?->id ?? $this->route('auberge');

        return [
            'nom' => [
                'required',
                'string',
                'max:255',
                Rule::unique('auberges', 'nom')->ignore($aubergeId),
            ],
            'adresse' => 'required|string|max:255',
            'ville' => 'nullable|string|max:255',
            'prix' => 'nullable|numeric|min:1',
            'description' => 'nullable|string',
            'telephone' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('auberges', 'telephone')->ignore($aubergeId),
            ],
            'nombre_chambres' => 'nullable|integer',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'destination_id' => 'required|exists:destinations,id',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'nom.required' => 'Le nom de l\'auberge est obligatoire.',
            'nom.unique' => 'Ce nom d\'auberge existe déjà. Veuillez en choisir un autre.',
            'telephone.unique' => 'Ce numéro de téléphone est déjà utilisé par une autre auberge.',
            'destination_id.required' => 'Veuillez sélectionner une destination.',
            'destination_id.exists' => 'La destination sélectionnée n\'existe pas.',
            'image.image' => 'Le fichier doit être une image.',
            'image.mimes' => 'L\'image doit être de type : jpeg, png, jpg, gif, webp.',
            'image.max' => 'La taille de l\'image ne doit pas dépasser 5 Mo.',
            'prix.gt' => 'Le prix doit être supérieur à 0.',
            'prix.numeric' => 'Le prix doit être un nombre valide.',
        ];
    }
}
