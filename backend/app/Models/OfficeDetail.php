<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OfficeDetail extends Model
{
    protected $fillable = [
        'office_name',
        'image',
        'address',
        'city',
        'latitude',
        'longitude'
    ];
}
