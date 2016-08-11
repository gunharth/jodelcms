<?php

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
        /**
         * posts
         */
        //index
        DB::table('posts')->insert([
            'template_id' => 3
        ]);
        // post 1
        DB::table('posts')->insert([
            'template_id' => 4
        ]);
        // post 2
        DB::table('posts')->insert([
            'template_id' => 4
        ]);

        /**
         * Page Translations
         */
        //index
        DB::table('post_translations')->insert([
            'post_id' => 1,
            'locale' => 'en',
            'slug' => 'home',
            'title' => 'Home',
            'content01' => 'Blog in English',
        ]);
        DB::table('post_translations')->insert([
            'post_id' => 1,
            'locale' => 'de',
            'slug' => 'start',
            'title' => 'Start',
            'content01' => 'Blog in Deutsch',
        ]);

        // post 1
        DB::table('post_translations')->insert([
            'post_id' => 2,
            'locale' => 'en',
            'slug' => 'post-1',
            'title' => 'Post 1',
            'content01' => 'Blog Post 1 in EN',
        ]);
        DB::table('post_translations')->insert([
            'post_id' => 2,
            'locale' => 'de',
            'slug' => 'post-1',
            'title' => 'Post 1',
            'content01' => 'Blog Eintrag 1 in Deutsch',
        ]);

        // post 2
        DB::table('post_translations')->insert([
            'post_id' => 3,
            'locale' => 'en',
            'slug' => 'post-2',
            'title' => 'Post 2',
            'content01' => 'Blog Post 2 in EN',
        ]);
        DB::table('post_translations')->insert([
            'post_id' => 3,
            'locale' => 'de',
            'slug' => 'post-2',
            'title' => 'Post 2',
            'content01' => 'Blog Eintrag 2 in Deutsch',
        ]);
    }
}
