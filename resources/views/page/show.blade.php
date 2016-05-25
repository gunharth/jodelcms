@extends('layout')

@section('content')
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1>{!! $page->title !!}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        {!! $page->contentLeft !!}
      </div>
      <div class="col-md-6">
        {!! $page->contentRight !!}
      </div>
    </div>
  </div><!-- /.container -->
  @if (Auth::check())
    <a href="/editor/page/{{ $page->id }}">Edit</a>
  @endif
@endsection
   
  </body>
</html>
