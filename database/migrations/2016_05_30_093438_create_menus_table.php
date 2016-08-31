<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMenusTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('menus', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('menu_type_id')->nullable()->index();
            $table->integer('morpher_id')->nullable();
            $table->string('morpher_type')->nullable();
            $table->string('external_link')->nullable();
            $table->boolean('active')->default(0)->index();
            $table->integer('parent_id')->nullable()->index();
            $table->integer('lft')->nullable()->index();
            $table->integer('rgt')->nullable()->index();
            $table->integer('depth')->nullable();
            $table->timestamps();
        });

        Schema::create('menu_translations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('menu_id')->unsigned();
            $table->string('locale')->index();

            $table->string('name', 50);
            $table->string('slug')->index();

            $table->unique(['slug', 'locale']);
            $table->foreign('menu_id')->references('id')->on('menus')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('menu_translations');
        Schema::drop('menus');
    }
}
