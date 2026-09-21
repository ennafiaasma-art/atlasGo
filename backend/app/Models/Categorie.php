<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $fillable = [
        'nom'];

    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
}
