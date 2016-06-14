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
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'hello@gunharth.io',
            'password' => bcrypt('123456'),
        ]);
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
        DB::table('pages')->insert([
            'title' => 'Home',
            'content01' => 'Welcome',
            'content02' => 'This is the homepage',
            'slug' => 'home',
            'template_id' => 1
        ]);
        DB::table('pages')->insert([
            'title' => 'Page 2',
            'content01' => 'Page 2',
            'content02' => 'This is page 2',
            'slug' => 'page-2',
            'template_id' => 2
        ]);
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
        DB::table('menues')->insert([
            'name' => 'Home',
            'parent_id' => 0,
            'parser_id' => 1,
            'parser_type' => 'App\Page',
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            'page_id' => 1,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menues')->insert([
            'name' => 'Page 2',
            'parent_id' => 0,
            'parser_id' => 2,
            'parser_type' => 'App\Page',
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            'page_id' => 2,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('menues')->insert([
            'name' => 'Blog',
            'parent_id' => 0,
            'parser_id' => 1,
            'parser_type' => 'App\Post',
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            'page_id' => 1,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        

        // $this->call(UsersTableSeeder::class);
    }
}
