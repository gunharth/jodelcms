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

Route::get('/', function () {
    return view('welcome');
});

Route::auth();

// Pages controller
// Ajax call to update
// others are resource
Route::post('page/{page}', 'PagesController@update');
Route::resource('page','PagesController', ['except' => ['update']]);
Route::get('editor/page/{page}', 'PagesController@loadiFrame');

Route::post('menue/sortorder', 'MenueController@postOrder');

/* Option for getting slug and finding correct routes through a controller
Route::get('{page}', function(Controller $page) {
	return Route::dispatchToRoute(Illuminate\Http\Request::create('page/'.$page));
});
*/



//Route::get('/home', 'HomeController@index');
