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

// Pages controller
// Ajax call to update
// others are resource
Route::post('text/{text}', 'TextController@update');
Route::resource('text','TextController', ['except' => ['update']]);
Route::get('editor/page/{text}', 'TextController@loadiFrame');
