<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Http\Controllers\Controller;

trait Traits
{

    public function loadiFrame($src)
    {
        return view('editor', compact('src'));
    }
    
}