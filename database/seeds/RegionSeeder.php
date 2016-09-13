<?php

use Illuminate\Database\Seeder;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        /*
         * Page Regions
         */
        // index
        DB::table('regions')->insert([
            'name' => 'region-1',
            'regionable_id' => 1,
            'regionable_type' => 'App\Page',
        ]);
        DB::table('regions')->insert([
            'name' => 'region-2',
            'regionable_id' => 1,
            'regionable_type' => 'App\Page',
        ]);

        // page 1
        DB::table('regions')->insert([
            'name' => 'region-1',
            'regionable_id' => 2,
            'regionable_type' => 'App\Page',
        ]);
        DB::table('regions')->insert([
            'name' => 'region-2',
            'regionable_id' => 2,
            'regionable_type' => 'App\Page',
        ]);
    }
}
