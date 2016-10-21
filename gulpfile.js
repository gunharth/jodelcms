const elixir = require('laravel-elixir');

//require('laravel-elixir-vue-2');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(mix => {
    mix.sass('app.scss')
        .rollup('app.js')
        .rollup(
          'editor_main.js',
          './resources/assets/js/editor.js'
        )
        .scripts([
          'editor.js',
          'editor/elements.js',
          'editor/elements/form.js',
          'editor/elements/map.js',
          'editor/elements/social.js',
          'editor/elements/spacer.js',
          'editor/elements/text.js'
          ], 'public/js/editor/editor.js')

       .copy('node_modules/tinymce', 'public/js/vendor/tinymce')
     //   .browserSync({
	    //     proxy: 'jodelcms.dev'
	    // });
});
