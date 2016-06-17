<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Menu;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        view()->composer('partials.nav', function($view)
        {
            $view->with('menu', Menu::with('parser')->where('active', '=', 1)->where('menu_id',1)->get());
        });
        view()->composer('partials.footer', function($view)
        {
            $view->with('menu', Menu::with('parser')->where('active', '=', 1)->where('menu_id',3)->get());
        });
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
