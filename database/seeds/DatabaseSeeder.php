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
        /*
         * Admin account
         */
        DB::table('users')->insert([
            'name' => 'Admin',
            'email' => 'hello@gunharth.io',
            'password' => bcrypt('123456'),
        ]);

        $this->call(SettingSeeder::class);

        /*
         * Externals need one entry to morph correctly
         */
        DB::table('externals')->insert([
            'title' => 'External Link',
        ]);

        $this->call(TemplateSeeder::class);

        $this->call(PageSeeder::class);

        $this->call(PostSeeder::class);

        //$this->call(MenuSeeder::class);

        //$this->call(RegionSeeder::class);

        //$this->call(ElementSeeder::class);
    }
}
