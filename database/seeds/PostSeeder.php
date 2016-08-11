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
        DB::table('posts')->insert([
            'template_id' => 3
        ]);
         DB::table('posts')->insert([
            'template_id' => 4
        ]);

        /**
         * Page Translations
         */
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

        DB::table('post_translations')->insert([
            'post_id' => 2,
            'locale' => 'en',
            'slug' => 'page-1',
            'title' => 'Page 1',
            'content01' => 'Blog Post 1 in EN',
        ]);
        DB::table('post_translations')->insert([
            'post_id' => 2,
            'locale' => 'de',
            'slug' => 'seite-1',
            'title' => 'Seite 1',
            'content01' => 'Blog Eintrag 1 in Deutsch',
        ]);
        

    }
}
