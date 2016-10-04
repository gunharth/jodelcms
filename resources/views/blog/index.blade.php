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
        <h1>{{ config('settings.blog_title') }}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
  			
        @foreach($posts as $post)
          @foreach ($post->regions as $reg) 
              @if ($reg->name == 'region-1')
                  @foreach ($reg->elements as $element)
                      {!! \App\Http\Controllers\ElementsController::renderElementView($element, $element->content, false) !!}
                      {{ $post->published_at }}
                  @endforeach
              @endif
              @if ($reg->name == 'region-3')
                  @foreach ($reg->elements as $element)
                      {!! \App\Http\Controllers\ElementsController::renderElementView($element, $element->content, false) !!}
                      <a href="{!! $post->link !!}">Full article</a>
                  @endforeach
              @endif
          @endforeach
        @endforeach


      </div>
    </div>
  
    <div class="row">
      <div class="col-md-12">
			{!! $posts->links() !!}
      </div>
    </div>
  </div>
  
@endsection