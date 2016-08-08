<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
         /**
         * Menus
         */
        DB::table('menus')->insert([
            'menu_type_id' => 1,
            'parent_id' => 0,
            'morpher_id' => 1,
            'morpher_type' => 'App\Page',
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        DB::table('menus')->insert([
            'menu_type_id' => 1,
            'parent_id' => 0,
            'morpher_id' => 2,
            'morpher_type' => 'App\Page',
            'lft' => 3,
            'rgt' => 4,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);


         /**
         * Menus Translations
         */
        
        // en
        DB::table('menu_translations')->insert([
            'menu_id' => 1,
            'locale' => 'en',
            'name' => 'Home',
            'slug' => '',
            	
        ]);
        DB::table('menu_translations')->insert([
            'menu_id' => 2,
            'locale' => 'en',
            'name' => 'Menu 1',
            'slug' => 'menu-1',
        ]);

         // de
        DB::table('menu_translations')->insert([
            'menu_id' => 1,
            'locale' => 'de',
            'name' => 'Start',
            'slug' => '',
                
        ]);
        DB::table('menu_translations')->insert([
            'menu_id' => 2,
            'locale' => 'de',
            'name' => 'Punkt 1',
            'slug' => 'punkt-1',
        ]);

    }
}
