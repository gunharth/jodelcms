<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>LK Test</title>

    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="/css/app.css">
    <link rel="stylesheet" href="/font-awesome/css/font-awesome.css">
    <link rel="stylesheet" href="/css/prism.css">
    <style>
      body { margin-top: 50px; }
      img { width: 100%; height: auto; }
    </style>
    @yield('styles')
  </head>
  
  <body>

  @include('partials.nav')
  @yield('content')
  @include('partials.footer')

  <script src="/js/app.js"></script>
  <script src="/js/prism.js"></script>

  @yield('scripts')

    </body>
</html>