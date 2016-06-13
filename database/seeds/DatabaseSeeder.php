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
        DB::table('pages')->insert([
            'title' => 'Home',
            'contentTitle' => 'Welcome',
            'contentLeft' => 'This is the homepage',
            'slug' => 'home'
        ]);
        DB::table('menues')->insert([
            'name' => 'Home',
            'parent_id' => 0,
            'lft' => 1,
            'rgt' => 2,
            'depth' => 0,
            'page_id' => 1,
            'active' => 1,
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);
        DB::table('posts')->insert([
            'title' => 'My first blog',
            'slug' => 'my-first-blog',
            'short_description' => 'My first blog content',
            'content' => 'My first blog content',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        // $this->call(UsersTableSeeder::class);
    }
}
