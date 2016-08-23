<?php

use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         * Templates
         */
        DB::table('templates')->insert([
            'name' => 'Homepage',
            'path' => 'page',
            'active' => 1,
        ]);
        DB::table('templates')->insert([
            'name' => 'Standard',
            'path' => 'standard',
            'active' => 1,
        ]);
        DB::table('templates')->insert([
            'name' => 'Four Columns',
            'path' => 'columns',
            'active' => 1,
        ]);
        DB::table('templates')->insert([
            'name' => 'Blog Index',
            'path' => 'blog',
            'active' => 0,
        ]);
        DB::table('templates')->insert([
            'name' => 'Blog page',
            'path' => 'page',
            'active' => 0,
        ]);
    }
}
