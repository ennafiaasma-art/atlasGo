<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caracteristique extends Model
{
    //
   protected $fillable = ['auberge_id', 'nom'];
public function chambres() {
    return $this->belongsToMany(Chambre::class, 'chambre_caracteristique');
}
}
