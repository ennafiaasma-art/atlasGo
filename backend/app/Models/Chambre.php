<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chambre extends Model
{
    protected $fillable = [
        'numero',
        'type',
        'prix',
        'auberge_id'];
        public function auberge()
    {
        return $this->belongsTo(Auberge::class);
    }
  public function caracteristiques()
    {
        return $this->belongsToMany(Caracteristique::class, 'chambre_caracteristique');
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

}
