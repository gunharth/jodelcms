<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use Spatie\Activitylog\Models\Activity;

class LogsController extends Controller
{
    
    public function index()
    {
    	//$logs = Activity::all()->last();
    	$logs = Activity::orderBy('created_at', 'DESC')->get();
    	//dd($logs);
    	return view('admin.logs', compact('logs'));
    }
}
