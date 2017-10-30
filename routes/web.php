<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your application. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
*/

Route::auth();

Route::group(['as' => 'direct', 'prefix' => LaravelLocalization::setLocale()], function () {

    /*
     * Pages
     */
    Route::get('/', 'PagesController@index')->name('.homepage'); // Homepage
    Route::get('page/{slug}', 'PagesController@show')->name('.showpage');

    /*
     * Blog
     */
    Route::get('blog', 'PostsController@index');
    Route::get('blog/{slug}', 'PostsController@show');

    /*
     * Test for renaming blog to articles
     * Guest view only
     */
    Route::get('articles/{post}', 'PostsController@show');
    Route::get('articles', 'PostsController@index');

    Route::post('elements/submitForm', 'ElementsController@formElementSend')->name('.elements.send');
});

/*
 * Admin Routes
 */

Route::group(['middleware' => 'auth', 'prefix' => LaravelLocalization::setLocale().'/admin'], function () {

    /*
     * Dev only reset Database
     */
    Route::get('/resetdb', function () {
        Artisan::call('migrate:refresh', [
            '--force' => true,
            '--seed' => true,
        ]);

        return redirect('/');
    });

    /*
     * Dev only clear cache
     */
    Route::get('/clearcache', function () {
        Artisan::call('cache:clear');
        Artisan::call('view:clear');

        return redirect('/');
    });

    /*
     * Admin Pages
     */
    Route::post('page', 'PagesController@store')->name('admin.page.store');
    Route::get('page/create', 'PagesController@create')->name('admin.page.create');
    Route::get('page/{slug}/edit', 'PagesController@edit')->name('editpage');
    Route::match(['put', 'patch'], 'page/{slug}/content', 'PagesController@updateContent')->name('admin.page.content');
    Route::match(['put', 'patch'], 'page/{id}', 'PagesController@update')->name('admin.page.update');
    Route::delete('page/{id}', 'PagesController@destroy');
    Route::post('page/duplicate', 'PagesController@duplicate');
    Route::get('page/{id}/settings', 'PagesController@settings');
    Route::get('page/listPages/{lang}', 'PagesController@editorList');
    // Elements
    Route::get('element/{id}', 'ElementsController@show');
    Route::post('element/add', 'ElementsController@add');
    Route::delete('element/{id}', 'ElementsController@destroy');
    Route::get('element/{element}/{id}/settings/{locale}', 'ElementsController@settings');
    Route::post('element/{element}/{id}/apply', 'ElementsController@apply');

    /*
     * Admin Blog
     */
    Route::get('blog/editIndex', 'PostsController@editIndex');
    Route::post('blog', 'PostsController@store')->name('admin.blog.store');
    Route::get('blog/create', 'PostsController@create')->name('admin.blog.create');
    Route::get('blog/{slug}/edit', 'PostsController@edit');
    Route::match(['put', 'patch'], 'blog/{post}/content', 'PostsController@updateContent')->name('admin.blog.content');
    Route::match(['put', 'patch'], 'blog/{id}', 'PostsController@update')->name('admin.blog.update');
    Route::get('blog/collectionIndex', 'PostsController@collectionIndex');
    Route::delete('blog/{id}', 'PostsController@destroy');
    Route::get('blog/{id}/settings', 'PostsController@settings');
    Route::get('blog/listCollectionItems', 'PostsController@editorList');

    /*
    * Admin Settings
    */
    Route::match(['put', 'patch'], 'settings', 'SettingsController@update')->name('admin.settings');
    Route::get('settings', 'SettingsController@settings');

    /*
     * Admin Menus
     */
    Route::post('menu', 'MenusController@store')->name('admin.menu.store');
    Route::get('menu/create/{id}', 'MenusController@create')->name('admin.menu.create');
    Route::match(['put', 'patch'], 'menu/{menu}', 'MenusController@update')->name('admin.menu.uppdate');
    Route::delete('menu/{id}', 'MenusController@destroy');
    Route::post('menu/sortorder', 'MenusController@postOrder');
    Route::post('menu/active', 'MenusController@postActive');
    Route::get('menu/{menu}/settings/{locale}', 'MenusController@settings');

    /*
     * Editor: Tab Menus
     * List and reload all Menus for selected nav
     * Type: ajax
     */
    Route::get('menu/listMenus/{id}/{lang}', 'MenusController@editorList');
    /*
     * Editor: Menu Popup: create and edit
     * Fill the select filed on Menu Type change
     * Type: ajax
     */
    Route::get('menuSelectorType/{type}', function ($type) {
        $model = '\App\\'.$type;

        return $model::orderBy('title')->get();
    });

    /*
     * Editor: generate Sitemap
     * wip
     */
    Route::get('sitemap', 'SitemapController@generateSitemap');

    /*
     * Editor: show event Log
     * Fill the select filed on Menu Type change
     * Type: ajax
     */

    Route::get('activity', 'LogsController@index');
});

/*
 *  Catch all route for slugs
 */
Route::group(['as' => 'menu', 'prefix' => LaravelLocalization::setLocale()], function () {
    Route::get('{slug}', function ($slug) {
        $categories = explode('/', $slug);
        $menus = new App\MenuTranslation;
        $translation = $menus->getBySlug(end($categories));
        if (! $translation) {
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

                return $controller->callAction('showID', $parameters = [$menu->morpher_id, $slug]);
            }
        }
        App::abort('404');
    })->where('slug', '^(?!_debugbar)[A-Za-z0-9_/-]+');
});
