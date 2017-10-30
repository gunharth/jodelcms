<?php

namespace App\Providers;

use Cache;
use Request;
use App\Menu;
use App\MenuTranslation;
use App\PageTranslation;
use Illuminate\Support\ServiceProvider;

class ViewsServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        /*
         * Main Menue View Composer
         */
        view()->composer('partials.nav', function ($view) {
            $path = Request::path();
            if (! empty($_GET['menu'])) {
                $path = $_GET['menu'];
            }

            $menus = Cache::remember('menus', 2, function () {
                return Menu::with('morpher')->whereActive(1)->whereMenuTypeId(1)->get();
            });
            //dd($menus);
            $view->with('menu', $menus)->with('path', $path);
        });

        /*
         * Language Switcher View Composer
         */
        view()->composer('partials.lang-switcher', function ($view) {
            $path = Request::path();
            if (isset($_GET['menu'])) {
                $path = $_GET['menu'];
            }

            $slugs = [];
            // dd(Request::route()->getName());
            switch (Request::route()->getName()) {
                case 'menu':
                    $categories = explode('/', $path);
                   // $active = Menu::where('slug','LIKE', '%"' . config('app.locale'). '":"' . end($categories) . '"%')->first();
                    $menus = new MenuTranslation;
                    $translation = $menus->getBySlug(end($categories));
                    $menu = $translation->menu;

                    //dd($menu);
                    //dd($menu->getDescendantsAndSelf());
                    $slugs = [];
                    foreach ($menu->getDescendantsAndSelf() as $descendant) {
                        $menuslugs = [];
                        foreach ($descendant->translations as $langs) {
                            $menuslugs[] = [$langs->locale => $langs->slug];
                        }
                        $slugs = $slugs + $menuslugs;
                    }
                    //dd($slugs);
                break;
                case 'direct.homepage':
                    //$categories = explode('/', $path);
                    //$page = Page::where('slug','LIKE', '%"' . config('app.locale'). '":"home"%')->first();
                    // $slugs[] = '{"en":"","de":""}';
                    $slugs = [];
                    $menuslugs[] = ['en' => ''];
                    $menuslugs[] = ['de' => ''];
                    $slugs = $slugs + $menuslugs;
                break;
                case 'direct.showpage': //Public direct loading of a page
                    $categories = explode('/', $path);
                    // //$page = Page::where('slug','LIKE', '%"' . config('app.locale'). '":"' . end($categories) . '"%')->first();
                    $translations = new PageTranslation;
                    $translation = $translations->getBySlug(end($categories));
                    $page = $translation->page;
                    //dd($page);

                    // $slugs[] = $page->getOriginal('slug');
                    //  $slugs = array();
                    // $menuslugs[] = [ 'en' => '' ];
                    // $menuslugs[] = [ 'de' => '' ];
                    // $slugs = $slugs+$menuslugs;
                    //
                    //
                    $slugs = [];
                    $menuslugs = [];
                        foreach ($page->translations as $langs) {
                            $menuslugs[] = [$langs->locale => $langs->slug];
                        }
                        $slugs = $slugs + $menuslugs;
                break;
                case 'editpage':
                    if (! empty($path)) {
                        // $categories = explode('/', $path);
                        // $active = Menu::where('slug','LIKE', '%"' . config('app.locale'). '":"' . end($categories) . '"%')->first();
                        // foreach($active->getDescendantsAndSelf() as $descendant) {
                        //   $slugs[] = $descendant->getOriginal('slug');
                        // }

                        $categories = explode('/', $path);
                        // $active = Menu::where('slug','LIKE', '%"' . config('app.locale'). '":"' . end($categories) . '"%')->first();
                        $menus = new MenuTranslation;
                        $translation = $menus->getBySlug(end($categories));
                        $menu = $translation->menu;

                        //dd($menu);
                        //dd($menu->getDescendantsAndSelf());
                        $slugs = [];
                        foreach ($menu->getDescendantsAndSelf() as $descendant) {
                            $menuslugs = [];
                            foreach ($descendant->translations as $langs) {
                                $menuslugs[] = [$langs->locale => $langs->slug];
                            }
                            $slugs = $slugs + $menuslugs;
                        }
                    } else {
                        $slugs = [];
                        $menuslugs[] = ['en' => ''];
                        $menuslugs[] = ['de' => ''];
                        $slugs = $slugs + $menuslugs;
                    }
                break;
            }
            //dd($slugs);
            $view->with('slugs', $slugs)->with('path', $path);
            //$view->with('slugs',$view->page->getOriginal('slug'));
            //$view->;
        });

        /*
         * Footer View Composer
         */
        view()->composer('partials.footer', function ($view) {
            // morper needed here?
            $view->with('menu', Menu::with('morpher')->where('active', '=', 1)->where('menu_type_id', 2)->get());
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
