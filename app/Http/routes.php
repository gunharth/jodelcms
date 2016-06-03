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

// Pages controller
// Ajax call to update
// others are resource
Route::get('/', 'PagesController@index');
Route::post('page/{page}', 'PagesController@update');
//Route::resource('page','PagesController', ['except' => ['update']]);
Route::get('editor/page/{page}', 'PagesController@loadiFrame');

Route::post('menue/sortorder', 'MenueController@postOrder');
Route::resource('menue','MenueController', ['except' => ['update']]);

/* Option for getting slug and finding correct routes through a controller*/
/*Route::get('{page}', function($page) {
	return Route::dispatchToRoute(Illuminate\Http\Request::create('page/'.$page));
});*/
Route::resource('page','PagesController', ['except' => ['update']]);
Route::get('forms/page/{page}', function() {
	return view('page.forms.create');
});
Route::get('/admin/forms/{type}/{action}', function($type,$action) {
	return view('admin.forms.'.'.'.$type.'.'.$action);
});



//Route::get('/home', 'HomeController@index');
