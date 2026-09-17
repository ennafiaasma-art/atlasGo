<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CaracteristiqueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // استخراج معرف الكاركتيرستيك الحالي في حالة التعديل (Update) لكي لا يتعارض مع نفسه
        $caracteristiqueId = $this->route('caracteristique')?->id ?? $this->route('id');

        return [
            'auberge_id' => 'required|exists:auberges,id',
            'nom' => [
                'required',
                'string',
                'max:255',
                Rule::unique('caracteristiques', 'nom')
                    ->where('auberge_id', $this->input('auberge_id'))
                    ->ignore($caracteristiqueId),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nom.unique' => 'Cette caractéristique existe déjà pour cette auberge.',
            'nom.required' => 'Le nom de la caractéristique est obligatoire.',
            'auberge_id.required' => 'L\'auberge est obligatoire.',
            'auberge_id.exists' => 'L\'auberge sélectionnée n\'existe pas.'
        ];
    }
}
