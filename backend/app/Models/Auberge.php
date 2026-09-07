<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Auberge extends Model
{
    //
    protected $fillable = [
        'nom',
        'adresse',
        'telephone',
        'image',
        'destination_id'];
        public function destination()
    {
        return $this->belongsTo(Destination::class);
    }

    public function chambres()
    {
        return $this->hasMany(Chambre::class);
    }
}
