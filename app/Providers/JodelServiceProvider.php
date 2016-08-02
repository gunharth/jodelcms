<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Request;

use App\Menu;

class JodelServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        /**
         * Main Menue View Composer
         */
        view()->composer('partials.nav', function($view)
        {
            $path = Request::path();
            if(!empty($_GET['menu'])) {
                $path = $_GET['menu'];
            }
            // $view->with('menu', Menu::where('active', '=', 1)->where('menu_id',1)->get())->with('path',$path);
            $view->with('menu', Menu::with('morpher')->whereActive(1)->whereMenuId(1)->get())->with('path',$path);
        });

        /**
         * Footer View Composer
         */
        view()->composer('partials.footer', function($view)
        {
            // morper needed here?
            $view->with('menu', Menu::with('morpher')->where('active', '=', 1)->where('menu_id',2)->get());
            // $path = Request::path();
            // if(!empty($_GET['menu'])) {
            //     $path = $_GET['menu'];
            // }
            // $view->with('menu', Menu::where('active', '=', 1)->where('menu_id',2)->get())->with('path',$path);
        });
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
