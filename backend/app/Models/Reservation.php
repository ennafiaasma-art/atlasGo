<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'date_debut',
        'date_fin',
        'nb_personne',
        'statut',
        'user_id',
        'activite_id',
        'chambre_id'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function auberge()
    {
        return $this->belongsTo(Auberge::class);
    }

    public function activite()
    {
        return $this->belongsTo(Activite::class);
    }

    public function chambre()
    {
        return $this->belongsTo(Chambre::class);
    }
}
