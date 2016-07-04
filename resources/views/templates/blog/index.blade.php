@extends('layout')

@section('content')
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1>Blog</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
			@foreach($posts as $post)
				<h2>{!! $post->title !!}</h2>
				{!! $post->short_description !!}
				<a href="/blog/{!! $post->slug !!}">Full article</a>
			@endforeach
      </div>
    </div>
  
  <div class="row">
      <div class="col-md-12">
			{!! $posts->render() !!}
      </div>
    </div>
  </div><!-- /.container -->
  
@endsection

@if (Auth::check())
@section('scripts')
    <script>
    $(document).ready(function() {
      //$('a[target!=_blank]').attr('target', '_top');
    });
  </script>
@endsection
@endif

