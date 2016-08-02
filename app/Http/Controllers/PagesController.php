<?php

namespace App\Http\Controllers;

use App\Http\Requests\PageRequest;
use Illuminate\Http\Request;
use App\Http\Requests;
use App\Template;
use App\Page;
use Auth;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $page = Page::findOrFail(1);
        if (Auth::check()) {
            $src = '/admin/page/'.$page->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view('index', compact('page'));
    }

    /**
     * Show the form for creating a new resource.
     *
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
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(PageRequest $request)
    {
        $page = Page::create($request->all());
        return $page;
        //return redirect()->route('page.show', [$page->slug]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($slug)
    {
        //dd($slug);
        $page = Page::with('template')->where('slug','LIKE', '%"' . $this->locale . '":"' . $slug . '"%')->first();
        // App\Task::where('content','like', '%"en": "english"%')->get();
        #$page = Page::find($id);
        //dd($page);
        if (Auth::check()) {
            $src = '/admin/page/'.$page->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view($page->template->path . '.show', compact('page'));
    }

    public function showID($id)
    {
        $page = Page::find($id);
        if (Auth::check()) {
            $src = '/admin/page/'.$page->slug.'/edit';
            return $this->loadiFrame($src);
        }
        return view($page->template->path . '.show', compact('page'));
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Page $page)
    {
        if ($page->template->id == 1) {
            return view('index', compact('page'));
        }
        return view($page->template->path . '.show', compact('page'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function settings($id)
    {
        $page = Page::findOrFail($id);
        $templates = Template::where('active', 1)->lists('name', 'id');
        return view('admin.page.settings', compact('page', 'templates'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(PageRequest $request, Page $page)
    {
        $page->fill($request->all())->save();
        return $page;
    }

    public function updateContent(PageRequest $request, Page $page)
    {
        $page->fill($request->all())->save();
        return $page;
    }

    public function duplicate(Request $request)
    {
        if ($request->ajax()) {
            $page = Page::findOrFail($request->id);
            $page->title = $page->title . ' copy';
            $clone = $page->replicate()->resluggify();
            $clone->save();
            return $clone;
        }
    }

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
    
    // public function loadiFrame($src)
    // {
    //     return view('editor', compact('src'));
    // }

    /**
     * Save the menu ordering
     *
     * @param Request $request
     */
    // public function postActive(Request $request)
    // {
    //     if ($request->ajax()) {
    //         $page = Page::findOrFail($request->id);
    //         $page->active = $request->active;
    //         $page->save();
    //     }
    // }


    /*public function postDelete(Request $request)
    {
        if ($request->ajax()) {
            $page = Page::findOrFail($request->id);
            $page->delete();
        }
    }*/
}
