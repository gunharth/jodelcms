<?php

namespace App\Http\Controllers;

trait Traits
{
    public function loadiFrame($src, $menu = null)
    {
        return view('editor', compact('src', 'menu'));
    }
}
