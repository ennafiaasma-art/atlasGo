<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chambre extends Model
{
    protected $fillable = [
        'numero',
        'type',
        'prix',
        'auberge_id',
        'caracteristique_id'];
        public function auberge()
    {
        return $this->belongsTo(Auberge::class);
    }
    public function caracteristique()
    {
        return $this->belongsTo(Caracteristique::class);
    }
    public function reservations()
    {
        return $this->hasMany(Reservation::class);
    }

}
