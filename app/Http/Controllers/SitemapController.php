<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Sitemap\SitemapGenerator;

class SitemapController extends Controller
{
    public function generateSitemap(Request $request)
    {
        SitemapGenerator::create($request->root())->writeToFile('sitemap.xml');

        return redirect()->back();
    }
}
