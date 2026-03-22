<?php
require __DIR__.'/backend/vendor/autoload.php';
$app = require_once __DIR__.'/backend/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Branch;
use App\Models\Plant;
use App\Models\Location;
use App\Models\Division;
use App\Models\Department;
use App\Models\OrganizationStructure;
use Illuminate\Support\Facades\Schema;

Schema::disableForeignKeyConstraints();
Branch::truncate();
Plant::truncate();
Location::truncate();
Division::truncate();
Department::truncate();
OrganizationStructure::truncate();
Schema::enableForeignKeyConstraints();

echo "Tables truncated successfully.\n";
