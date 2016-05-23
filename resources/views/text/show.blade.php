@extends('layout')

@section('content')
  <div class="container">
    <div class="row"><h1>{!! $text->title !!}</h1></div>
    <div class="row">
      <div class="col-md-6">
        <div>{!! $text->contentLeft !!}</div>
      </div>
      <div class="col-md-6">
        <div>{!! $text->contentRight !!}</div>
      </div>
    </div>
  </div><!-- /.container -->
@endsection
   
  </body>
</html>
