<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caracteristique extends Model
{
    //
    protected $fillable = [
        'vue',
        'wifi',
        'etage',
        'climatisation',
        'tv'];
    public function chambres()
    {
        return $this->hasMany(Chambre::class);
    }
}
