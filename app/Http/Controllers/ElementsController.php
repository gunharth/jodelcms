<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Region;
use App\Element;
use Mail;
use App;

class ElementsController extends Controller
{
    /**
     * Display Elements called from App\Helpers.
     * @param  [object]  $element  [description]
     * @param  [type]  $content  [description]
     * @param  bool $editable [description]
     * @return [type]            [description]
     */
    public static function renderElementView($element, $content, $editable = true)
    {
        $element->options = json_decode($element->options);

        return view('elements.'.$element->type, compact('element', 'content', 'editable'))->render();
    }

    public static function renderDummyView($element, $content)
    {
        $element->options = json_decode($element->options);

        return view('admin.elements.'.$element->type.'dummy', compact('element', 'content'))->render();
    }

    /**
     * Apply Element Settings.
     * @param  Request $request
     * @param  object  $element
     * @param  int  $id
     * @return view
     */
    public static function apply(Request $request, $element, $id)
    {
        $options = json_decode($request->options);

        return view('elements.updateForm', compact('options'))->render();
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
    }

    /**
     * Add a new Element to the UI.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    // public function store(Request $request)
    // {
    //     $region = Region::findOrFail($request->id);
    //     $element = new Element();
    //     $element->type = $request->type;
    //     $element->options = $request->options;
    //     $element->order = $request->order;
    //     $region->elements()->save($element);

    //     return $this->renderElementView($element, '');
    // }
    // 
    public function add(Request $request)
    {
        //$region = Region::findOrFail($request->id);
        $element = new Element();
        $element->id = $request->dummyID;
        $element->type = $request->type;
        $element->options = $request->options;
        $element->order = $request->order;
        //$region->elements()->save($element);

        return $this->renderDummyView($element, '');
    }

    public static function store($dummies)
    {
       foreach ($dummies as $elem) {

                $region = Region::findOrFail($elem['region']);
                $element = new Element();
                //$element->id = $request->dummyID;
                //$element->region_id = $elem['region'];
                $element->type = $elem['type'];
                $element->content = $elem['content'];
                $element->options = $elem['options'];
                $element->order = $elem['order'];
                $region->elements()->save($element);
            }
    }

    public static function update($updates)
    {
        foreach ($updates as $elem) {
            $element = Element::findOrFail($elem['id']);
            $element->region_id = $elem['region'];
            $element->content = $elem['content'];
            $element->options = $elem['options'];
            $element->order = $elem['order'];
            $element->save();
        } 
    }

    //public function destroy(Request $request)
    // {
    //     if ($request->ajax()) {
    //         $element = Element::findOrFail($request->id);
    //         $element->delete();

    //         return ['success' => true, 'message' => 'Item deleted!'];
    //     }
    // }

    public static function destroy($deletes)
    {
        foreach ($deletes as $elem) {
            $element = Element::findOrFail($elem['id']);
            $element->delete();
        } 
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
        $element->options = json_decode($element->options);
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
        // if ($request->ajax()) {
        //     $elements = $request->element;
        //     foreach ($elements as $key => $id) {
        //         $elm = Element::findOrFail($id);
        //         $elm->order = $key;
        //         $elm->save();
        //     }
        // }
    }

    // public function destroy(Request $request)
    // {
    //     if ($request->ajax()) {
    //         $element = Element::findOrFail($request->id);
    //         $element->delete();

    //         return ['success' => true, 'message' => 'Item deleted!'];
    //     }
    // }

    /**
     * Submit form Element _ TODO: change to mailable.
     * @param  Request $request
     * @return json
     */
    public function formElementSend(Request $request)
    {
        $element = Element::findOrFail($request->id);

        $options = json_decode($element->options);

        $i = 0;
        $rules = [];
        foreach ($options->fields as $field) {
            $fields[] = ['name' => $field->title, 'value' => $request->field[$i]];
            if ($field->isMandatory) {
                $rules['field.'.$i] = 'required';
            }
            $i++;
        }
        $this->validate($request, $rules);

        Mail::send('elements.formmail', ['fields' => $fields], function ($message) use ($options) {
            $message->from('guest@gunharth.io', 'Website Visitor');
            $message->to('hello@gunharth.io');
            $message->subject($options->subject);
        });

        return $options->response;
    }
}
