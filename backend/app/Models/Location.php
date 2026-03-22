<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['name', 'plant_id', 'company_id', 'created_by'];

    public function plant()
    {
        return $this->belongsTo(Plant::class);
    }

    public function divisions()
    {
        return $this->hasMany(Division::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
