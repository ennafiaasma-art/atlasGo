<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activite extends Model
{
    protected $fillable = [
    'nom',
    'description',
    'prix',
    'image',
    'destination_id',
    'categorie_id'];
    //
    public function destination()
    {
        return $this->belongsTo(Destination::class);
    }
    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

}
