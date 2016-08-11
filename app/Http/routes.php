<?php

Route::auth();


Route::group(['as' => 'direct', 'prefix' => LaravelLocalization::setLocale()], function () {
    
    /**
     * Pages
     */
    Route::get('/', ['as' => '.homepage', 'uses' => 'PagesController@index']); // Homepage
    Route::get('page/{slug}', ['as' => '.showpage', 'uses' => 'PagesController@show']);

    /**
     * Blog
     */
    Route::get('blog', 'PostsController@index');
    //Route::get('blog/indexEditor', 'PostsController@indexEditor');
    Route::get('blog/{slug}', 'PostsController@show');
    //Route::get('blog/{post}/edit', 'PostsController@edit');
    
    Route::post('blog/{post}', 'PostsController@update');
    Route::resource('blog', 'PostsController');

    /**
     * Test for renaming blog to articles
     * Guest view only
     */
    Route::get('articles/{post}', 'PostsController@show');
    Route::get('articles', 'PostsController@index');

});

/**
 * Admin Routes
 */

Route::group(['middleware' => 'auth', 'prefix' => LaravelLocalization::setLocale().'/admin'], function () {
    
    /**
     * Dev only reset Database
     */
    Route::get('/Dataseed', function () {
        Artisan::call('migrate:refresh', [
            '--force' => true,
            '--seed' => true,
        ]);
        return redirect('/');
    });

    /**
     * Admin Pages
     */
    Route::post('page',         ['as' => 'admin.page.store',    'uses' => 'PagesController@store']);
    Route::get('page/create',   ['as' => 'admin.page.create',   'uses' => 'PagesController@create']);
    Route::get('page/{slug}/edit', ['as' => 'editpage', 'uses' => 'PagesController@edit']);
    Route::match(['put', 'patch'], 'page/{slug}/content', ['as' => 'admin.page.content', 'uses' => 'PagesController@updateContent']);
    Route::match(['put', 'patch'], 'page/{id}', ['as' => 'admin.page.update', 'uses' => 'PagesController@update']);
    Route::delete('page/{id}', 'PagesController@destroy');
    Route::post('page/duplicate', 'PagesController@duplicate');
    Route::get('page/{page}/settings', 'PagesController@settings');

    /**
     * Editor: Tab Pages
     * List and reload all pages
     * Type: ajax
     */
    Route::get('page/listPages/{lang}', 'PagesController@editorList');
    // Route::get('page/listPages', function () {
    //     $html = '';
    //     foreach (\App\Page::orderBy('title')->get() as $page) {
    //         $html .= renderEditorPages($page);
    //     }
    //     return $html;
    // });
    
    /**
     * Admin Blog
     */
    Route::get('blog/indexEditor', 'PostsController@indexEditor');
    Route::get('blog/{slug}/edit', 'PostsController@edit');

    Route::match(['put', 'patch'], 'blog/{post}/content', ['as' => 'admin.blog.content', 'uses' => 'PostsController@updateContent']);
    Route::get('blog/adminIndex', 'PostsController@adminIndex');
    

    /**
     * Admin Menus
     */
    Route::post('menu', ['as' => 'admin.menu.store', 'uses' => 'MenusController@store']);
    Route::get('menu/create/{id}', ['as' => 'admin.menu.create', 'uses' => 'MenusController@create']);
    Route::match(['put', 'patch'], 'menu/{menu}', ['as' => 'admin.menu.update', 'uses' => 'MenusController@update']);
    Route::delete('menu/{id}', 'MenusController@destroy');
    
    Route::post('menu/sortorder', 'MenusController@postOrder');
    Route::post('menu/active', 'MenusController@postActive');
    Route::get('menu/{menu}/settings/{locale}', 'MenusController@settings');
    
    /**
     * Editor: Tab Menus
     * List and reload all Menus for selected nav
     * Type: ajax
     */
    Route::get('menu/listMenus/{id}/{lang}', 'MenusController@editorList');
    /**
     * Editor: Menu Popup: create and edit
     * Fill the select filed on Menu Type change
     * Type: ajax
     */
    Route::get('menuSelectorType/{type}', function ($type) {
        $model = '\App\\'.$type;
        return $model::orderBy('title')->get();
    });


    

    

    
    

    /**
     * Editor: show event Log
     * Fill the select filed on Menu Type change
     * Type: ajax
     */
    Route::get('activity', 'LogsController@index');

});

/**
 *  Manually register elfinder again to override slug below
 */
Route::group(['prefix' => 'elfinder'], function () {
    Route::get('/', 'ElfinderController@showIndex');
    Route::any('connector', ['as' => 'elfinder.connector', 'uses' => 'ElfinderController@showConnector']);
    Route::get('popup/{input_id}', ['as' => 'elfinder.popup', 'uses' => 'ElfinderController@showPopup']);
    Route::get('filepicker/{input_id}', ['as' => 'elfinder.filepicker', 'uses' => 'ElfinderController@showFilePicker']);
    Route::get('tinymce', ['as' => 'elfinder.tinymce', 'uses' => 'ElfinderController@showTinyMCE']);
    Route::get('tinymce4', ['as' => 'elfinder.tinymce4', 'uses' => 'ElfinderController@showTinyMCE4']);
    Route::get('ckeditor', ['as' => 'elfinder.ckeditor', 'uses' => 'ElfinderController@showCKeditor4']);
});


/**
 *  Catch all route for slugs
 */
Route::group(['as' => 'menu', 'prefix' => LaravelLocalization::setLocale()], function () {
    Route::get('{slug}', function ($slug) {
        $categories = explode('/', $slug);
        $menus = new App\MenuTranslation;
        $translation = $menus->getBySlug(end($categories));
        if ( ! $translation)
        {
            return App::abort(404);
        }
        $menu = $translation->menu;
        reset($categories);

        if ($menu) {
            $ancestors = $menu->getAncestors();
            $valid = true;
            foreach ($ancestors as $i => $category) {
                if ($category->slug !== $categories[$i]) {
                    $valid = false;
                    break;
                }
            }
            if ($valid) {
                $app = app();
                $model = new $menu->morpher_type;
                $controller = $app->make('App\Http\Controllers\\'.$model->returnController());
                return $controller->callAction('showID', $parameters = array($menu->morpher_id,$slug));
            }
        }
        App::abort('404');
    })->where('slug', '^(?!_debugbar)[A-Za-z0-9_/-]+');
});
