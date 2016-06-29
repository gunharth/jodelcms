<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
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
            $view->with('menu', Menu::with('morpher')->where('active', '=', 1)->where('menu_id',1)->get());
        });

        /**
         * Footer View Composer
         */
        view()->composer('partials.footer', function($view)
        {
            $view->with('menu', Menu::with('morpher')->where('active', '=', 1)->where('menu_id',3)->get());
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
