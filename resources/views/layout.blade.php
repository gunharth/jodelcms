<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('meta_title')</title>
    <meta name="description" content="@yield('meta_description')">
    <meta name="description" content="@yield('meta_keywords')">
    @if (Auth::check())
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @endif

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="/css/app.css">
    <link rel="stylesheet" href="/font-awesome/css/font-awesome.css">
    <link rel="stylesheet" href="/css/prism.css">
    <style>
      body { margin-top: 50px; }
      img { width: 100%; height: auto; }
    </style>
    @yield('styles')
    @yield('head_code')
  </head>
  
  <body>
    @yield('body_start_code')

    @include('partials.nav')
    @yield('content')
    @include('partials.footer')

    <script src="/js/app.js"></script>
    <script src="/js/prism.js"></script>

    @yield('scripts')
    @yield('body_end_code')
  </body>
</html>