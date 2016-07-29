<!DOCTYPE html>
<html lang="en">
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
  </head>
  
  <body>
    @yield('body_start_code')

    @include('partials.nav')
    <h1>dfsf</h1>
    @yield('content')
    @include('partials.footer')

    <script src="/js/app.js"></script>
    <script src="/js/prism.js"></script>
    @if (Auth::check())
        <script src='/js/tinymce/tinymce.min.js'></script>
        <script src='/js/admin.js'></script>
    @endif
    @yield('templateScripts')
    @yield('body_end_code')
  </body>
</html>