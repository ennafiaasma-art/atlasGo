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

    public function auberges()
    {
        return $this->hasMany(Auberge::class);
    }
    public function user()
{
    return $this->belongsTo(User::class);
}

public function favorites()
{
    return $this->hasMany(Favorite::class);
}
public function users()
    {
        return $this->belongsToMany(User::class, 'favorites', 'destination_id', 'user_id');
    }
}
