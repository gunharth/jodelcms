<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Region;
use App\Element;
use App;

class ElementsController extends Controller
{
    
    public static function renderElementView($element)
    {
        $element->options = json_decode($element->options);

        return view('elements.'.$element->type, compact('element'))->render();
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request)
    {
        $element = Element::findOrFail($request->id);

        return $element;
            //return ['success' => true, 'message' => 'Item deleted!'];
        //}
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //if ($request->ajax()) {
        $region = Region::findOrFail($request->id);
        $element = new Element();
        $element->type = $request->type;
        $element->order = $request->order;
        $region->elements()->save($element);

        return $element;
            //return ['success' => true, 'message' => 'Item deleted!'];
        //}
    }

    /**
     * Show the form for editing the specified menu.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function settings($handler, $id, $editorLocale)
    {
        App::setLocale($editorLocale);
        $element = Element::findOrFail($id);

        return view('admin.elements.'.$handler, compact('element'));
    }

    // /**
    //  * Update the specified menu in storage.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @param  int  $id
    //  * @return \Illuminate\Http\Response
    //  */
    // public function update(Request $request, $id)
    // {
    //     $menu = Element::findOrFail($id);
    //     Cache::forget('menus');
    //     $menu = $menu->fill($request->all())->save();

    //     return 'true';
    // }

    /**
     * Save the element ordering.
     *
     * @param Request $request
     */
    public function sort(Request $request)
    {
        if ($request->ajax()) {
            $elements = $request->element;
            foreach ($elements as $key => $id) {
                $elm = Element::findOrFail($id);
                $elm->order = $key;
                //return $elm;
                $elm->save();
            }
        }
    }

    public function destroy(Request $request)
    {
        if ($request->ajax()) {
            $element = Element::findOrFail($request->id);
            $element->delete();

            return ['success' => true, 'message' => 'Item deleted!'];
        }
    }
}
