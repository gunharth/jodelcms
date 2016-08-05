<?php

namespace App\Http\Controllers;

use App\Http\Requests\MenuRequest;
use Illuminate\Http\Request;
use App\Menu;
use App\Page;
use Config;
use App;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class MenusController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

   /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $id)
    {
        if ($request->ajax()) {
            $menu = new Menu;
            return view('admin.menu.create', compact('id','menu'));
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(MenuRequest $request, Menu $translatable)
    {
        $locale = config('app.fallback_locale');
        $translatables = $translatable->getTranslatable();
        $menu = new Menu;
        //$slug = str_slug($request->slug, "-");
        //$request->merge(array('slug' => $slug));
        $menu->fill($request->all());
        
        //$request->merge(array('slug' => $slug));
        foreach($translatables as $key => $value) {
            //dd($value);
            //$menu->setTranslation($value, $locale, $menu->$value);
            $menu->setTranslation($value, $locale, $request->$value);
        }
        dd($menu);
        //$menu = Menu::create($request->all());
        $menu->save();
        return $menu;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }


    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function settings($id, $editorLocale)
    {
        $appLocale = config('app.locale');
        App::setLocale($editorLocale);
        $menu = Menu::findOrFail($id);
        //dd($menu->name);
        $pages = Page::lists('title', 'id')->toArray();
        //App::setLocale($appLocale);

        return view('admin.menu.edit', compact('menu', 'pages'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(MenuRequest $request, $id, Menu $translatable)
    {
        // $locale = $request->lang;
        $locale = $request->locale;
        $menu = Menu::findOrFail($id);
        $slug = str_slug($request->slug, "-");
        if ($id == 1) {
            $slug = ' ';
        }
        $request->merge(array('slug' => $slug));
        $translatables = $translatable->getTranslatable();
        $protectedtranslatables = $translatable->getNotTranslatableOnUpdate();
        foreach($translatables as $key => $value) {
            if(in_array($value,$protectedtranslatables)) {
                $orig = $menu->getTranslation($value, $locale);
                $menu->setTranslation($value, $locale, $orig);
            } else {
                $menu->setTranslation($value, $locale, $request->$value);
            }
        }
        $menu->save();
        return $menu;
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
            $menu = Menu::findOrFail($request->id);
            $menu->delete();
            return ['success' => true, 'message' => 'Item deleted!'];
        }
    }

    /**
     * Editor list all Menus
     *
     * @param Request $request
     */
    public function editorList($id, $editorLocale)
    {
        $appLocale = config('app.locale');
        App::setLocale($editorLocale);
        $html = '';
        foreach (Menu::where('menu_id', $id)->get()->toHierarchy() as $node) {
            $html .= renderEditorMenus($node, $editorLocale);
        }
        App::setLocale($appLocale);
        return $html;
    }

    /**
     * Save the menu ordering
     *
     * @param Request $request
     */
    public function postOrder(Request $request)
    {
        if ($request->ajax()) {
            //dd($request->getContent());
            $menus = json_decode($request->getContent());
            foreach ($menus as $p) {
                $menu = Menu::findOrFail($p->id);
                $menu->lft = $p->lft;
                $menu->rgt = $p->rgt;
                $menu->parent_id = $p->parent_id != "" ? $p->parent_id : null;
                $menu->depth = $p->depth;
                $menu->save();
            }
        }
    }

    /**
     * Save the menu ordering
     *
     * @param Request $request
     */
    public function postActive(Request $request)
    {
        if ($request->ajax()) {
            $menu = Menu::findOrFail($request->id);
            $menu->active = $request->active;
            $menu->save();
        }
    }

    /**
     * Save the menu ordering
     *
     * @param Request $request
     */
    // public function postDelete(Request $request)
    // {
    //     if ($request->ajax()) {
    //         $menu = Menu::findOrFail($request->id);
    //         $menu->delete();
    //     }
    // }
}
