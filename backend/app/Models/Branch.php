<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $fillable = ['name', 'company_id', 'location_id'];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function plants()
    {
        return $this->hasMany(Plant::class);
    }
}
