<?php

use Illuminate\Database\Seeder;
use Carbon\Carbon;

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
            'content01' => 'Home',
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
            'content02' => '<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sit corporis explicabo suscipit, facere ratione ab nam commodi, ex consectetur at eaque et tempore tenetur earum, blanditiis nostrum harum labore optio.</p>
<p>Eum molestias, quia quae corrupti, iusto cupiditate, incidunt ut quidem vitae nisi, error fugiat rem harum alias sapiente numquam doloribus vel atque ipsa a repudiandae expedita suscipit quisquam! Soluta, quasi!</p>
<p>Doloremque tempora dolores ullam autem consectetur ea, quos nulla doloribus, iure minus omnis, ex beatae natus nesciunt, deleniti nemo adipisci aut. Porro iusto enim sit labore at neque quibusdam suscipit.</p>
<p>Tempora quae culpa laborum, consectetur nisi dicta labore assumenda officiis unde optio, voluptas asperiores, tempore odit qui corporis impedit obcaecati quas nulla sapiente molestias eligendi corrupti? Laboriosam at vero expedita?</p>
<p>Nam molestiae quas libero, at architecto ullam id repellendus eum quidem repudiandae temporibus inventore dolorum cum praesentium tempora, soluta aperiam itaque. Dicta officiis eius, labore quam, veniam fuga animi iusto.</p>
<p>Perspiciatis possimus necessitatibus fuga, molestiae consequatur ex, repellendus alias. Labore repellendus, nemo ipsum! Dolor quas labore quidem molestias. Optio a dolorum, porro numquam cupiditate deserunt recusandae ratione, illum nisi distinctio.</p>',
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
