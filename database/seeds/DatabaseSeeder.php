<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /**
         * Admin account
         */
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'hello@gunharth.io',
            'password' => bcrypt('123456'),
        ]);

        /**
         * Templates
         */
        DB::table('templates')->insert([
            'name' => 'Homepage',
            'path' => 'page',
            'active' => 1
        ]);
        DB::table('templates')->insert([
            'name' => 'Standard',
            'path' => 'standard',
            'active' => 1
        ]);
        DB::table('templates')->insert([
            'name' => 'Four Columns',
            'path' => 'columns',
            'active' => 1
        ]);
        DB::table('templates')->insert([
            'name' => 'Blog Index',
            'path' => 'blog',
            'active' => 0
        ]);
        DB::table('templates')->insert([
            'name' => 'Blog page',
            'path' => 'page',
            'active' => 0
        ]);

        /**
         * Pages
         */
        DB::table('pages')->insert([
            'title' => 'Home',
            'content01' => '{"en":"english","de":"deutsch"}',
            'content02' => 'This is the homepage - uses 1 full column layout',
            'slug' => '{"en":"home","de":"home"}',
            'template_id' => 1
        ]);
        DB::table('pages')->insert([
            'title' => 'Page 1',
            'content01' => '{"en":"english","de":"deutsch"}',
            'content02' => 'Page 1 uses the standard template with 2 columns',
            'content03' => 'Menu 1 links to Page 1',
            'slug' => '{"en":"page-1","de":"seite-1"}',
            'template_id' => 2
        ]);
        DB::table('pages')->insert([
            'title' => 'Page 2',
            'content01' => '{"en":"english","de":"deutsch"}',
            'content02' => 'Page 2 uses the standard template with 4 columns',
            'content03' => 'Menu 2 links to Page 2',
            'slug' => '{"en":"page-2","de":"seite-2"}',
            'template_id' => 3
        ]);

        /**
         * Blog Pages
         */
        DB::table('posts')->insert([
            'title' => 'Blog - a sample collection',
            'content01' => '{"en":"english","de":"deutsch"}',
            'content02' => 'Blog Home',
            'content03' => 'Blog Home',
            'slug' => 'home',
            'template_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()

        ]);
        DB::table('posts')->insert([
            'title' => 'My first Blog',
            'content01' => '{"en":"english","de":"deutsch"}',
            'content02' => 'My first Blog short description for blog homepage',
            'content03' => 'My first Blog content ...',
            'slug' => 'my-blog-1',
            'template_id' => 4,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('posts')->insert([
            'title' => 'My second Blog',
            'content01' => '{"en":"english","de":"deutsch"}',
            'content02' => 'My second Blog short description for blog homepage',
            'content03' => 'My second Blog content ...',
            'slug' => 'my-blog-2',
            'template_id' => 4,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        /**
         * Pages
         */
        DB::table('externals')->insert([
            'title' => 'External Link',
        ]);

        /**
         * Menus
         */
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => '{"en":"Home","de":"Start"}',
            'slug' => '{"en":"","de":""}',
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
            'menu_id' => 1,
            'name' => '{"en":"Menu 1","de":"Punkt 1"}',
            'slug' => '{"en":"menu-1","de":"punkt-1"}',
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
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => '{"en":"Menu 2","de":"Punkt 2"}',
            'slug' => '{"en":"menu-2","de":"punkt-2"}',
            'parent_id' => 0,
            'morpher_id' => 3,
            'morpher_type' => 'App\Page',
            'lft' => 5,
            'rgt' => 6,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => '{"en":"Blog","de":"Blog"}',
            'slug' => '{"en":"blog","de":"blog"}',
            'parent_id' => 0,
            'morpher_id' => 1,
            'morpher_type' => 'App\Post',
            'lft' => 9,
            'rgt' => 10,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => '{"en":"Google","de":"Google Link"}',
            'slug' => '{"en":"google","de":"google"}',
            'external_link' => 'http://www.google.com',
            'parent_id' => 0,
            'morpher_id' => 1,
            'morpher_type' => 'App\External',
            'lft' => 11,
            'rgt' => 12,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 2,
            'name' => '{"en":"Footer","de":"Fußzeile"}',
            'slug' => '{"en":"footer","de":"fuss"}',
            'parent_id' => 0,
            'morpher_id' => 2,
            'morpher_type' => 'App\Page',
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

    }
}
