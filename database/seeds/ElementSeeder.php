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
            'type' => 'text',
            'order' => 0,
        ]);
        // element_id 2
        DB::table('elements')->insert([
            'region_id' => 1,
            'type' => 'text',
            'order' => 1,
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
        // element_id 3
        DB::table('elements')->insert([
            'region_id' => 3,
            'type' => 'text',
            'order' => 0,

        ]);
        // element_id 4
        DB::table('elements')->insert([
            'region_id' => 4,
            'type' => 'text',
            'order' => 1,
        ]);
        // element_id 5
        DB::table('elements')->insert([
            'region_id' => 4,
            'type' => 'form',
            'order' => 1,
        ]);
        // element_id 6
        DB::table('elements')->insert([
            'region_id' => 4,
            'type' => 'spacer',
            'order' => 1,
        ]);

        DB::table('element_translations')->insert([
            'element_id' => 3,
            'locale' => 'en',
            'content' => '<h1>Lorem</h1>',
        ]);
        DB::table('element_translations')->insert([
            'element_id' => 4,
            'locale' => 'en',
            'content' => '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi non mi leo. Vivamus lacus lorem, molestie sit amet nunc eget, ullamcorper porttitor dui. Mauris condimentum pretium erat, eu faucibus tortor auctor nec. Curabitur sed enim quis ante auctor gravida. Aenean metus est, tristique id purus ac, commodo sagittis justo. Mauris condimentum lobortis egestas. Sed egestas dui dolor, non varius neque auctor a. Cras et congue lectus. Aliquam sollicitudin efficitur sem, ac convallis libero vestibulum ut. Vivamus at libero porta, vestibulum urna vitae, commodo magna. Vivamus ut sapien sit amet velit aliquam sagittis non quis ante. Nullam sed rutrum lacus. Maecenas pulvinar fermentum faucibus. Integer ut magna egestas, suscipit erat eget, porttitor nisl.</p>',
        ]);
        DB::table('element_translations')->insert([
            'element_id' => 5,
            'locale' => 'en',
            'content' => '',
            'options' => '{"email_type": "default","email": "","subject": "","thanks_msg": "","submit": "fsdfsfd","style": "s-horizontal","fields": [{"type": "text","title": "Test","isMandatory": false}]}',
        ]);
        DB::table('element_translations')->insert([
            'element_id' => 6,
            'locale' => 'en',
            'content' => '',
            'options' => '{"size": "60"}',
        ]);

        //DE
        DB::table('element_translations')->insert([
            'element_id' => 3,
            'locale' => 'de',
            'content' => 'Page 1, DE, Region 1, Element 3',
        ]);
        DB::table('element_translations')->insert([
            'element_id' => 4,
            'locale' => 'de',
            'content' => 'Page 1, DE, Region 1, Element 4',
        ]);
    }
}
