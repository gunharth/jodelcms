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
            $table->integer('template_id')->nullable();

            $table->string('head_code')->nullable();
            $table->string('body_start_code')->nullable();
            $table->string('body_end_code')->nullable();

            $table->timestamps();
        });

        Schema::create('page_translations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('page_id')->unsigned();
            $table->string('locale')->index();

            $table->string('title')->nullable();
            $table->string('slug')->index();
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

            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->string('meta_keywords')->nullable();

            $table->unique(['slug','locale']);
            $table->foreign('page_id')->references('id')->on('pages')->onDelete('cascade');
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
        Schema::drop('page_translations');
    }
}
