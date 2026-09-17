<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class CaracteristiqueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'auberge_id' => 'required|exists:auberges,id', // التأكد أن الأوبيرج كاين
            'nom' => 'required|string|max:255',          // اسم الخاصية (مثلاً: Wifi, Vue sur montagne...)
        ];
    }
}
