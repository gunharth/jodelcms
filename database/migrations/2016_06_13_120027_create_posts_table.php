<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePostsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('posts', function ($table) {
            $table->increments('id');
            $table->integer('template_id')->nullable();

            $table->text('head_code')->nullable();
            $table->text('body_start_code')->nullable();
            $table->text('body_end_code')->nullable();

            $table->timestamp('published_at');

            $table->timestamps();
        });

        Schema::create('post_translations', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('post_id')->unsigned();
            $table->string('locale')->index();

            $table->string('title')->nullable();
            $table->string('slug')->index();
            // $table->text('content01')->nullable();
            // $table->text('content02')->nullable();
            // $table->text('content03')->nullable();

            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->text('meta_keywords')->nullable();

            $table->unique(['slug', 'locale']);
            $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('post_translations');
        Schema::dropIfExists('posts');
    }
}
