<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $fillable = [
        'nom',
        'destination_id' 
    ];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
