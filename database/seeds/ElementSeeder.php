<?php

use Illuminate\Database\Seeder;

class ElementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         * Pages
         */
        // index
        // element_id 1
        DB::table('elements')->insert([
            'region_id' => 1,
        ]);
        // element_id 2
        DB::table('elements')->insert([
            'region_id' => 1,
        ]);


        DB::table('element_translations')->insert([
            'element_id' => 1,
            'locale' => 'en',
            'content' => 'EN Homepage Text',
        ]);
        DB::table('element_translations')->insert([
            'element_id' => 2,
            'locale' => 'en',
            'content' => 'EN Homepage Text',
        ]);

        //DE
        DB::table('element_translations')->insert([
            'element_id' => 1,
            'locale' => 'de',
            'content' => 'DE Homepage Text',
        ]);
        DB::table('element_translations')->insert([
            'element_id' => 2,
            'locale' => 'de',
            'content' => 'DE Homepage Text More',
        ]);


        // page 1
        // element_id 1
        DB::table('elements')->insert([
            'region_id' => 3,
        ]);
        // element_id 2
        DB::table('elements')->insert([
            'region_id' => 3,
        ]);


        DB::table('element_translations')->insert([
            'element_id' => 3,
            'locale' => 'en',
            'content' => 'EN Homepage Text',
        ]);
        DB::table('element_translations')->insert([
            'element_id' => 4,
            'locale' => 'en',
            'content' => 'EN Homepage Text',
        ]);

        //DE
        DB::table('element_translations')->insert([
            'element_id' => 3,
            'locale' => 'de',
            'content' => 'DE Homepage Text',
        ]);
        DB::table('element_translations')->insert([
            'element_id' => 4,
            'locale' => 'de',
            'content' => 'DE Homepage Text More',
        ]);
    }
}
