<?php

namespace App\Http\Controllers;

use Spatie\Sitemap\SitemapGenerator;
use Illuminate\Http\Request;

class SitemapController extends Controller
{
    public function generateSitemap(Request $request)
    {
        SitemapGenerator::create($request->root())->writeToFile('sitemap.xml');

        return redirect()->back();
    }
}
