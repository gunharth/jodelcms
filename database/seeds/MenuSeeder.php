<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         * Menus
         */
        // Home
        DB::table('menus')->insert([
            'menu_type_id' => 1,
            'parent_id' => null,
            'morpher_id' => 1,
            'morpher_type' => 'App\Page',
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Menu 1 - Page 1
        DB::table('menus')->insert([
            'menu_type_id' => 1,
            'parent_id' => null,
            'morpher_id' => 2,
            'morpher_type' => 'App\Page',
            'lft' => 3,
            'rgt' => 4,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // Blog
        DB::table('menus')->insert([
            'menu_type_id' => 1,
            'parent_id' => null,
            'morpher_id' => 1,
            'morpher_type' => 'App\Post',
            'lft' => 5,
            'rgt' => 6,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        // External
        DB::table('menus')->insert([
            'menu_type_id' => 1,
            'parent_id' => null,
            'morpher_id' => 1,
            'morpher_type' => 'App\External',
            'external_link' => 'http://google.com',
            'lft' => 7,
            'rgt' => 8,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now(),
        ]);

        /*
        * Menus Translations
        */

        // Home
        DB::table('menu_translations')->insert([
            'menu_id' => 1,
            'locale' => 'en',
            'name' => 'Home',
            'slug' => '',
        ]);
        DB::table('menu_translations')->insert([
            'menu_id' => 1,
            'locale' => 'de',
            'name' => 'Start',
            'slug' => '',
        ]);

        // Menu 1 - Page 1
        DB::table('menu_translations')->insert([
            'menu_id' => 2,
            'locale' => 'en',
            'name' => 'Menu 1',
            'slug' => 'menu-1',
        ]);
        DB::table('menu_translations')->insert([
            'menu_id' => 2,
            'locale' => 'de',
            'name' => 'Punkt 1',
            'slug' => 'punkt-1',
        ]);

        // Blog
        DB::table('menu_translations')->insert([
            'menu_id' => 3,
            'locale' => 'en',
            'name' => 'Blog',
            'slug' => 'blog',
        ]);
        DB::table('menu_translations')->insert([
            'menu_id' => 3,
            'locale' => 'de',
            'name' => 'Blog',
            'slug' => 'blog',
        ]);

        // Blog
        DB::table('menu_translations')->insert([
            'menu_id' => 4,
            'locale' => 'en',
            'name' => 'Google',
            'slug' => 'google',
        ]);
        DB::table('menu_translations')->insert([
            'menu_id' => 4,
            'locale' => 'de',
            'name' => 'Google',
            'slug' => 'google',
        ]);
    }
}
