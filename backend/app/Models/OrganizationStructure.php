<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrganizationStructure extends Model
{
    protected $fillable = [
        'company_id',
        'location_id',
        'branch_id',
        'plant_id',
        'division_id',
        'department_id'
    ];

    public function company() { return $this->belongsTo(Company::class); }
    public function location() { return $this->belongsTo(Location::class); }
    public function branch() { return $this->belongsTo(Branch::class); }
    public function plant() { return $this->belongsTo(Plant::class); }
    public function division() { return $this->belongsTo(Division::class); }
    public function department() { return $this->belongsTo(Department::class); }
}
