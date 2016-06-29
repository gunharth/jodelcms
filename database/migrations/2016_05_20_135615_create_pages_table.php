<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pages', function (Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            //variable content blocks
            $table->text('content01')->nullable();
            $table->text('content02')->nullable();
            $table->text('content03')->nullable();
            $table->text('content04')->nullable();
            $table->text('content05')->nullable();
            $table->text('content06')->nullable();
            $table->text('content07')->nullable();
            $table->text('content08')->nullable();
            $table->text('content09')->nullable();
            $table->text('content10')->nullable();
            // settings
            $table->string('slug')->nullable()->index();
            $table->integer('template_id')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('pages');
    }
}
