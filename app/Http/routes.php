<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/



Route::auth();

Route::get('/', 'PagesController@index');



// Pages controller
//Route::get('/', 'PagesController@index');
//Route::post('page/active', 'PageController@postActive');
Route::post('page/delete', 'PagesController@postDelete');
Route::get('page/{page}/settings', 'PagesController@settings');
Route::post('page/{page}', 'PagesController@update');

Route::resource('page','PagesController');

Route::get('blog/indexEditor','PostsController@indexEditor');
Route::get('blog/{post}','PostsController@show');
Route::get('blog/{post}/edit','PostsController@edit');
Route::get('blog','PostsController@index');
Route::post('blog/{post}', 'PostsController@update');

Route::resource('blog','PostsController');
// Route::get('{slug}', function($slug) {
// 	// find which type of controller
// 	$cont = '\PagesController';
// 	//return Route::dispatchToRoute(Illuminate\Http\Request::create('page/'.$page));
// 	//return $slug;
// 	$app = app();
//     $controller = $app->make('\App\Http\Controllers'.$cont);
//     return $controller->callAction('show', $parameters = array($slug));

// })->where('slug', '^(?!_debugbar)[A-Za-z0-9_/-]+');

// menu controller
Route::post('menu/sortorder', 'MenusController@postOrder');
Route::post('menu/active', 'MenusController@postActive');
Route::post('menu/delete', 'MenusController@postDelete');
Route::get('menu/{menu}/settings', 'MenusController@settings');
Route::resource('menu','MenusController');


Route::get('forms/page/{page}', function() {
	return view('page.forms.create');
});
Route::get('/admin/forms/{type}/{action}/{id?}', function($type,$action,$id=null) {
	$templates = \App\Template::where('active', 1)->lists('name', 'id');
	//return view('admin.forms.'.$type.'.'.$action)->with('templates', $templates, 'id', $id);
	return view('admin.forms.'.$type.'.'.$action, compact('templates', 'id'));
});
Route::get('/admin/menu/listMenus/{id}', function($id) {
	$html = '';
	foreach(\App\Menu::where('menu_id',$id)->get()->toHierarchy() as $node) {
		$html .= renderNode($node);
	}
	return $html;
});


Route::get('/{slug}', function($slug)
{
    $categories = explode('/', $slug);
    //return end($categories);
    $main = App\Menu::where('slug', end($categories))->first();
    /*if (!$main) {
    	$main = App\Menu::where('slug', prev($categories))->first();
    }*/
    reset($categories);

    if ($main)
    {
        $ancestors = $main->getAncestors();

        $valid = true;

        foreach ($ancestors as $i => $category)
        {
            if ($category->slug !== $categories[$i])
            {
                $valid = false;
                break;
            }
        }

        if ($valid)
        {
            $app = app();
			//$yo = 'PagesController';
			$targetController = "App\Http\Controllers\\".$main->morpher_controller;
			$controller = $app->make($targetController);
			return $controller->callAction('showID', $parameters = array($main->morpher_id));
        }
    }
    //try next up

    App::abort('404');

})->where('slug', '^(?!_debugbar)[A-Za-z0-9_/-]+');


//Route::get('/home', 'HomeController@index');
