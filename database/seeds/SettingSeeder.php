<?php

use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('settings')->insert([
            'name' => 'googlemap_api',
            'value' => 'AIzaSyCRqfUKokTWoFg77sAhHOBew_NLgepcTOM',
        ]);

        DB::table('settings')->insert([
            'name' => 'blog_title',
            'value' => 'Blog Home',
        ]);
        DB::table('settings')->insert([
            'name' => 'blog_paginate',
            'value' => '10',
        ]);
    }
}
