<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageAccess extends Model
{
    protected $fillable = [
        'user_id',
        'page_name',
        'can_access',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
