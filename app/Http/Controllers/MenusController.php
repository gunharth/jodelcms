<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests\MenuRequest;
use App\Menu;
use App\Page;
use Config;

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
    public function store(MenuRequest $request)
    {
        $menu = Menu::create($request->all());
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
    public function settings($id)
    {
        $menu = Menu::findOrFail($id);
        $pages = Page::lists('title', 'id')->toArray();
        return view('admin.forms.menu.edit', compact('menu','pages'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(MenuRequest $request, $id)
    {
        $menu = Menu::findOrFail($id);
        $slug = str_slug($request->slug, "-");
        if($id == 1) { $slug = ' '; }
        $request->merge(array('slug' => $slug));
        $menu->fill($request->all())->save();
        return $menu;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if ($request->ajax()) {
            $menu = Menu::findOrFail($request->id);
            $menu->delete();
        }
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
    public function postDelete(Request $request)
    {
        if ($request->ajax()) {
            $menu = Menu::findOrFail($request->id);
            $menu->delete();
        }
    }

}
