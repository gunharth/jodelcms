<?php

namespace App\Http\Controllers;

use Spatie\Activitylog\Models\Activity;

class LogsController extends Controller
{
    public function index()
    {
        $logs = Activity::orderBy('created_at', 'DESC')->get();

        return view('admin.logs', compact('logs'));
    }
}
