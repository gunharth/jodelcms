<!DOCTYPE html>
<html lang="{{ config('app.locale') }}">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('meta_title')</title>
    <meta name="description" content="@yield('meta_description')">
    <meta name="keywords" content="@yield('meta_keywords')">
    @if (Auth::check())
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @endif

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="/css/app.css">
    <link rel="stylesheet" href="/font-awesome/css/font-awesome.css">
    <link rel="stylesheet" href="/css/prism.css">
    @if (Auth::check())
        <link rel="stylesheet" href="/css/admin.css">
    @endif
    @yield('templateStyles')
    @yield('head_code') 
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Roboto:300,400,500,700" type="text/css">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  @if (Auth::check())
        <script>
            var options = {};
        </script>
    @endif
  </head>
  
  <body>
    @yield('body_start_code')

    @include('partials.nav')
    @yield('content')
    @include('partials.footer')

    <script src="/js/app.js"></script>
    <script src="/js/prism.js"></script>
    <script src="http://fezvrasta.github.io/bootstrap-material-design/dist/js/material.js"></script>
    <script src="http://fezvrasta.github.io/bootstrap-material-design/dist/js/ripples.min.js"></script>
    
        <script>
  $.material.init();
</script>
    @if (Auth::check())
        <script src='/js/vendor/tinymce/tinymce.min.js'></script>
        <script src='/js/admin.js'></script>
    @endif
    @yield('templateScripts')
    @include('elements.mapjs')
    @stack('elementsScripts')
    @yield('body_end_code')
  </body>
</html>