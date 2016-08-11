@extends('layout')

@section('meta_title'){{ $post->meta_title }}@endsection
@section('meta_description'){{ $post->meta_description }}@endsection
@section('meta_keywords'){{ $post->meta_keywords }}@endsection
@section('head_code'){{ $post->head_code }}@endsection
@section('body_start_code'){{ $post->body_start_code }}@endsection
@section('body_end_code'){{ $post->body_end_code }}@endsection

@section('content')
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1>{{ $post->title }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
  			@foreach($posts as $post)
  				<h2>{!! $post->content01 !!}</h2>
  				{!! $post->content02 !!}
  				<a href="{!! $post->link !!}">Full article</a>
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