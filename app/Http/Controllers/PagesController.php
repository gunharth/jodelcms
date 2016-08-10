<?php

namespace App\Http\Controllers;

use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use App\Http\Requests\PageRequest;
use Illuminate\Http\Request;
use App\PageTranslation;
use App\Http\Requests;
use App\Template;
use App\Page;
use Auth;
use App;

class PagesController extends Controller
{

    use Traits;

    private $locale;
    
    public function __construct()
    {
        $this->middleware('auth', ['except' =>['show', 'index'] ]);
        $this->locale = LaravelLocalization::getCurrentLocale();
    }

    /**
     * Display main index resource
     * If logged in redirect to iframe calling @edit
     * route: /
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $page = Page::findOrFail(1);
        if (Auth::check()) {
            $src = '/' . $this->locale . '/admin/page/'.$page->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view('index', compact('page'));
    }

    /**
     * Display a specified resource
     * If logged in redirect to iframe calling @edit
     * route: resource/{slug}
     * @param  string $slug,  $translations
     * @return \Illuminate\Http\Response
     */
    public function show($slug, PageTranslation $translations)
    {
        $translation = $translations->getBySlug($slug);
        if (! $translation) {
            return App::abort(404);
        }
        $page = $translation->page;
        if (Auth::check()) {
            $src = '/' . $this->locale . '/admin/page/'.$page->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view($page->template->path . '.show', compact('page'));
    }

    /**
     * Display a specified resource from linked menu.
     * If logged in redirect to iframe calling @admin.edit
     * route: menu {slug}
     * @param  int $pageid, string $menuslug
     * @return \Illuminate\Http\Response
     */
    public function showID($id, $slug)
    {
        $page = Page::find($id);
        if (Auth::check()) {
            $src = '/' . $this->locale . '/admin/page/'.$page->slug.'/edit';
            if ($this->locale != config('app.fallback_locale')) {
                $slug = $this->locale . '/' . $slug;
            }
            return $this->loadiFrame($src, $slug);
        }
        return view($page->template->path . '.show', compact('page'));
    }

    /**
     * iframe content to edit resource
     * @param  $request, $slug, $translations
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, $slug, PageTranslation $translations)
    {
        $translation = $translations->getBySlug($slug);
        $page = $translation->page;
        if ($page->template->id == 1) {
            return view('index', compact('page'));
        }
        return view($page->template->path . '.show', compact('page'));
    }

    /**
     * Update content areas of specified resource
     * ajax route: @admin updateContent
     * @param  int $resourceid, string $menuslug
     * @return \Illuminate\Http\Response
     */
    public function updateContent(Request $request, $slug, PageTranslation $translations)
    {
        if ($request->ajax()) {
            $translation = $translations->getBySlug($slug);
            if (! $translation) {
                return App::abort(404);
            }
            $page = $translation->page;
            if (!$page->hasTranslation($this->locale)) {
                $page->title = $page->translateOrDefault($this->locale)->title;
                $page->slug = $slug;
            }
            $page->fill($request->all());
            $page->save();
            return $page;
        }
    }

    /**
     * Editor functions
     */

    /**
     * Load editor create form
     * ajax route
     * @param  $request
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        if ($request->ajax()) {
            $templates = Template::where('active', 1)->lists('name', 'id');
            $page = new Page;
            $page->template = Template::findOrFail(2);
            return view('admin.page.create', compact('templates', 'page'));
        }
    }

    /**
     * Editor store new resource
     * ajax route
     * @param  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PageRequest $request)
    {
        if ($request->ajax()) {
            $page = Page::create($request->all());
            return $page;
        }
    }
    
    /**
     * Load editor settings form 
     * ajax route
     * @param  $request
     * @return \Illuminate\Http\Response
     */
    public function settings(Request $request, $id)
    {
        if ($request->ajax()) {
            //App::setLocale($editorLocale);
            $page = Page::findOrFail($id);
            $templates = Template::where('active', 1)->lists('name', 'id');
            return view('admin.page.settings', compact('page', 'templates'));
        }
    }

    /**
     * Store settings
     * ajax route
     * @param  $request
     * @return \Illuminate\Http\Response
     */
    public function update(PageRequest $request, $id)
    {
        if ($request->ajax()) {
            $page = Page::findOrFail($id);
            if (!$page->hasTranslation($this->locale)) {
                $page->title = $page->translateOrDefault($this->locale)->title;
                $page->slug = $page->translateOrDefault($this->locale)->slug;
            }
            $page->fill($request->all())->save();
            return $page;
        }
    }

    
    // maybe?
    // public function duplicate(Request $request)
    // {
    //     if ($request->ajax()) {
    //         $page = Page::findOrFail($request->id);
    //         $page->title = $page->title . ' copy';
    //         $clone = $page->replicate()->resluggify();
    //         $clone->save();
    //         return $clone;
    //     }
    // }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        if ($request->ajax()) {
            $page = Page::findOrFail($id);
            $page->delete();
            return ['success' => true, 'message' => 'Item deleted!'];
        }
    }

    /**
     * Editor list all Pages
     *
     * @param Request $request
     */
    public function editorList($editorLocale)
    {
        App::setLocale($editorLocale);
        $html = '';
        foreach (Page::orderBy('title')->get() as $page) {
            $html .= renderEditorPages($page, $editorLocale);
        }
        return $html;
    }
}
