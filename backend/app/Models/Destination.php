<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Destination extends Model
{
protected $fillable = [
     'nom',
     'description',
     'ville',
     'province',
     'image'];
public function activites()
    {
        return $this->hasMany(Activite::class);
    }
    public function auberges()
    {
        return $this->hasMany(Auberge::class);
    }

//
}
