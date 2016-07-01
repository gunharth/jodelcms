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
            'active' => 0
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
            'content01' => 'Welcome',
            'content02' => 'This is the homepage',
            'slug' => 'home',
            'template_id' => 1
        ]);
        DB::table('pages')->insert([
            'title' => 'Page 1',
            'content01' => 'Page 1',
            'content02' => 'This is page 1',
            'slug' => 'page-1',
            'template_id' => 2
        ]);
        DB::table('pages')->insert([
            'title' => 'Page 2',
            'content01' => 'Page 2',
            'content02' => 'This is page 2',
            'slug' => 'page-2',
            'template_id' => 2
        ]);
        DB::table('pages')->insert([
            'title' => 'Page 3',
            'content01' => 'Page 3',
            'content02' => 'This is page 3',
            'slug' => 'page-3',
            'template_id' => 2
        ]);

        /**
         * Blog Pages
         */
        DB::table('posts')->insert([
            'title' => 'Blog Home',
            'slug' => 'home',
            'short_description' => 'Blog Home',
            'content' => 'Blog Home',
            'template_id' => 3,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()

        ]);
        DB::table('posts')->insert([
            'title' => 'My first Blog',
            'slug' => 'my-first-blog',
            'short_description' => 'My first Blog description',
            'content' => 'My first Blog content',
            'template_id' => 4,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('posts')->insert([
            'title' => 'My second Blog',
            'slug' => 'my-blog-2',
            'short_description' => 'My second Blog description',
            'content' => 'My second Blog content',
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
            'name' => 'Home',
            'slug' => '',
            'parent_id' => 0,
            'morpher_id' => 1,
            'morpher_type' => 'App\Page',
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            //'page_id' => 1,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => 'Menu 1',
            'slug' => 'menu-1',
            'parent_id' => 0,
            'morpher_id' => 2,
            'morpher_type' => 'App\Page',
            'lft' => 3,
            'rgt' => 4,
            'depth' => 0,
            //'page_id' => 2,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => 'Menu 2',
            'slug' => 'menu-2',
            'parent_id' => 0,
            'morpher_id' => 3,
            'morpher_type' => 'App\Page',
            'lft' => 5,
            'rgt' => 6,
            'depth' => 0,
            //'page_id' => 2,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => 'Menu 3',
            'slug' => 'menu-3',
            'parent_id' => 0,
            'morpher_id' => 4,
            'morpher_type' => 'App\Page',
            'lft' => 7,
            'rgt' => 8,
            'depth' => 0,
            //'page_id' => 2,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => 'Blog',
            'slug' => 'blog',
            'parent_id' => 0,
            'morpher_id' => 1,
            'morpher_type' => 'App\Post',
            'lft' => 9,
            'rgt' => 10,
            'depth' => 0,
            //'page_id' => 1,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 1,
            'name' => 'Google',
            'slug' => 'google',
            'external_link' => 'http://www.google.com',
            'parent_id' => 0,
            'morpher_id' => 1,
            'morpher_type' => 'App\External',
            'lft' => 11,
            'rgt' => 12,
            'depth' => 0,
            //'page_id' => 1,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menus')->insert([
            'menu_id' => 3,
            'name' => 'Footer',
            'slug' => 'footer',
            'parent_id' => 0,
            'morpher_id' => 2,
            'morpher_type' => 'App\Page',
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            //'page_id' => 2,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        

        // $this->call(UsersTableSeeder::class);
    }
}
