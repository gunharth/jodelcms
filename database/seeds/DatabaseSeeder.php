<?php

use Illuminate\Database\Seeder;

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
            'page_id' => 1
        ]);

        // $this->call(UsersTableSeeder::class);
    }
}
