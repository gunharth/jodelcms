<?php

namespace App\Http\Controllers;

use App;
use Cache;
use Config;
use App\Menu;
use App\Page;
use Illuminate\Http\Request;
use App\Http\Requests\MenuRequest;

class MenusController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the form for creating a new menu.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request, $id)
    {
        if ($request->ajax()) {
            $menu = new Menu;

            return view('admin.menu.create', compact('id', 'menu'));
        }
    }

    /**
     * Store a newly created menu in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(MenuRequest $request)
    {
        $menu = Menu::create($request->all());

        Cache::forget('menus');

        return $menu;
    }

    /**
     * Show the form for editing the specified menu.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function settings($id, $editorLocale)
    {
        App::setLocale($editorLocale);
        $menu = Menu::findOrFail($id);
        $pages = Page::pluck('title', 'id')->toArray();

        return view('admin.menu.edit', compact('menu', 'pages'));
    }

    /**
     * Update the specified menu in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(MenuRequest $request, $id)
    {
        $menu = Menu::findOrFail($id);
        Cache::forget('menus');
        $menu = $menu->fill($request->all())->save();

        return 'true';
    }

    /**
     * Remove the specified menu from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
        if ($request->ajax()) {
            Cache::forget('menus');
            $menu = Menu::findOrFail($request->id);
            $menu->delete();

            return ['success' => true, 'message' => 'Item deleted!'];
        }
    }

    /**
     * Editor list all Menus.
     *
     * @param Request $request
     */
    public function editorList($id, $editorLocale)
    {
        //$appLocale = config('app.locale');
        App::setLocale($editorLocale);
        $html = '';
        foreach (Menu::where('menu_type_id', $id)->get()->toHierarchy() as $node) {
            $html .= renderEditorMenus($node, $editorLocale);
        }
        //App::setLocale($appLocale);
        return $html;
    }

    /**
     * Save the menu ordering.
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
                $menu->parent_id = $p->parent_id != '' ? $p->parent_id : null;
                $menu->depth = $p->depth;
                $menu->save();
            }
            Cache::forget('menus');
        }
    }

    /**
     * Store the status of the menu.
     *
     * @param Request $request
     */
    public function postActive(Request $request)
    {
        if ($request->ajax()) {
            $menu = Menu::findOrFail($request->id);
            $menu->active = $request->active;
            $menu->save();
            Cache::forget('menus');
        }
    }
}
