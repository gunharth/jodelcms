<?php

namespace App\Http\Controllers;

use Spatie\Sitemap\SitemapGenerator;
use Illuminate\Http\Request;
use App\Http\Requests;
use Spatie\Tags\Url;
use Carbon\Carbon;

class SitemapController extends Controller
{
    public function generateSitemap(Request $request)
    {
        SitemapGenerator::create($request->root())->writeToFile('sitemap.xml');
        return redirect()->back();
    }
}
