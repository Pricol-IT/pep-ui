<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Division extends Model
{
    protected $fillable = ['name', 'location_id', 'created_by'];

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function departments()
    {
        return $this->hasMany(Department::class);
    }
}
