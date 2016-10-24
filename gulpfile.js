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
        //.copy('node_modules/jquery-ui-dist/jquery-ui.js', 'public/packages/jquery-ui/jquery-ui.js')
        .scripts([
          './node_modules/jquery/dist/jquery.js',
          './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
          './node_modules/jquery-ui-dist/jquery-ui.js',
          './node_modules/jquery-ui-touch-punch/jquery.ui.touch-punch.js',
          './node_modules/nestable-fork/src/jquery.nestable.js',
          'editor.js',
          'editor/elements.js',
          'editor/elements/form.js',
          'editor/elements/map.js',
          'editor/elements/social.js',
          'editor/elements/spacer.js',
          'editor/elements/text.js'
          ], 'public/js/editor.js')
        //tinymce
       .copy('node_modules/tinymce', 'public/packages/tinymce')
       // jquery-ui
       
       .copy('node_modules/jquery-ui-dist/jquery-ui.css', 'public/packages/jquery-ui/jquery-ui.css')
       .copy('node_modules/jquery-ui-dist/images', 'public/packages/jquery-ui/images')
     //   .browserSync({
	    //     proxy: 'jodelcms.dev'
	    // });
});
