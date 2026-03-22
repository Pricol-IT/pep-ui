<?php

namespace App\Http\Controllers;

use App\Models\LoginLog;
use App\Models\LinkClick;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function getLogins(Request $request)
    {
        $filter = $request->query('filter', 'day'); // day, week, month
        
        $query = LoginLog::select(
            DB::raw('count(*) as count'),
            $this->getGroupByRaw($filter, 'login_at')
        );

        $data = $this->applyTimeFilter($query, $filter, 'login_at')
            ->groupBy('label')
            ->orderBy('label')
            ->get();

        return response()->json($data);
    }

    public function getClicks(Request $request)
    {
        $filter = $request->query('filter', 'day');
        
        $query = LinkClick::select(
            DB::raw('count(*) as count'),
            $this->getGroupByRaw($filter, 'clicked_at')
        );

        $stats = $this->applyTimeFilter($query, $filter, 'clicked_at')
            ->groupBy('label')
            ->orderBy('label')
            ->get();

        $topLinks = LinkClick::select('url', 'text', DB::raw('count(*) as count'))
            ->groupBy('url', 'text')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return response()->json([
            'stats' => $stats,
            'topLinks' => $topLinks
        ]);
    }

    public function getTasks(Request $request)
    {
        $filter = $request->query('filter', 'day');

        $addedQuery = Task::select(
            DB::raw('count(*) as count'),
            $this->getGroupByRaw($filter, 'created_at')
        );
        $added = $this->applyTimeFilter($addedQuery, $filter, 'created_at')
            ->groupBy('label')
            ->orderBy('label')
            ->get();

        $completedQuery = Task::where('is_completed', true)
            ->select(
                DB::raw('count(*) as count'),
                $this->getGroupByRaw($filter, 'updated_at')
            );
        $completed = $this->applyTimeFilter($completedQuery, $filter, 'updated_at')
            ->groupBy('label')
            ->orderBy('label')
            ->get();

        return response()->json([
            'added' => $added,
            'completed' => $completed
        ]);
    }

    private function getGroupByRaw($filter, $column)
    {
        switch ($filter) {
            case 'month':
                return DB::raw("DATE_FORMAT($column, '%Y-%m') as label");
            case 'week':
                return DB::raw("YEARWEEK($column, 1) as label");
            case 'day':
            default:
                return DB::raw("DATE($column) as label");
        }
    }

    private function applyTimeFilter($query, $filter, $column)
    {
        switch ($filter) {
            case 'month':
                return $query->where($column, '>=', now()->subMonths(12));
            case 'week':
                return $query->where($column, '>=', now()->subWeeks(12));
            case 'day':
            default:
                return $query->where($column, '>=', now()->subDays(30));
        }
    }
}
