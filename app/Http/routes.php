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
Route::post('text/{text}', 'TextController@update');
Route::resource('text','TextController', ['except' => ['update']]);
Route::get('editor/page/{text}', 'TextController@loadiFrame');

/* Option for getting slug and finding correct routes through a controller
Route::get('{text}', function(Controller $text) {
	return Route::dispatchToRoute(Illuminate\Http\Request::create('text/'.$text));
});
*/



//Route::get('/home', 'HomeController@index');
