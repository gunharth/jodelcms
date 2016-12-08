<?php

use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         * posts
         */
        //index
        DB::table('posts')->insert([
            'template_id' => 3,
            'published_at' => Carbon::now(),
        ]);
        // post 1
        DB::table('posts')->insert([
            'template_id' => 4,
            'published_at' => Carbon::now()->subDays(2),
        ]);
        // post 2
        DB::table('posts')->insert([
            'template_id' => 4,
            'published_at' => Carbon::yesterday(),
        ]);

        /*
         * Page Translations
         */
        //index
        DB::table('post_translations')->insert([
            'post_id' => 1,
            'locale' => 'en',
            'slug' => 'home',
            'title' => 'Home',
        ]);
        DB::table('post_translations')->insert([
            'post_id' => 1,
            'locale' => 'de',
            'slug' => 'start',
            'title' => 'Start',
        ]);

        // post 1
        DB::table('post_translations')->insert([
            'post_id' => 2,
            'locale' => 'en',
            'slug' => 'post-1',
            'title' => 'Post 1',
        ]);
        DB::table('post_translations')->insert([
            'post_id' => 2,
            'locale' => 'de',
            'slug' => 'post-1',
            'title' => 'Post 1',
        ]);

        // post 2
        DB::table('post_translations')->insert([
            'post_id' => 3,
            'locale' => 'en',
            'slug' => 'post-2',
            'title' => 'Post 2',
        ]);
        DB::table('post_translations')->insert([
            'post_id' => 3,
            'locale' => 'de',
            'slug' => 'post-2',
            'title' => 'Post 2',
        ]);
    }
}
