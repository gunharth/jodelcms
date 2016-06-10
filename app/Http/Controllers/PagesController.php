<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests;
use App\Page;
use Auth;

class PagesController extends Controller
{
    

    public function __construct()
    {
        $this->middleware('auth', ['except' =>['show','index'] ]);
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
            return $this->loadiFrame($page);
        }
        return view('page.show', compact('page'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->slug = str_slug($request->title, "-");
        $page = Page::create($request->all());
        return redirect()->route('page.show',[$request->slug]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Page $page)
    {
        if (Auth::check()) {
            return $this->loadiFrame($page);
        }
        return view('page.show', compact('page'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit(Page $page)
    {
        return view('page.show', compact('page'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Page $page)
    {
        //$data = ;
        $page->fill($request->all())->save();
        return 'true';
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
    
    public function loadiFrame(Page $page)
    {
        return view('editor', compact('page'));
    }

    /**
     * Save the menu ordering
     *
     * @param Request $request
     */
    public function postActive(Request $request)
    {
        if ($request->ajax()) {
            $page = Menue::findOrFail($request->id);
            $page->active = $request->active;
            $page->save();
        }
    }

    /**
     * Save the menu ordering
     *
     * @param Request $request
     */
    public function postDelete(Request $request)
    {
        if ($request->ajax()) {
            $page = Page::findOrFail($request->id);
            $page->delete();
        }
    }
}
