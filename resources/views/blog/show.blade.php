@extends('layout')

@section('meta_title'){{ $post->meta_title }}@endsection
@section('meta_description'){{ $post->meta_description }}@endsection
@section('meta_keywords'){{ $post->meta_keywords }}@endsection
@section('head_code'){{ $post->head_code }}@endsection
@section('body_start_code'){{ $post->body_start_code }}@endsection
@section('body_end_code'){{ $post->body_end_code }}@endsection

@section('content')
@if (Auth::check()) <input type="hidden" id="url" value="/{!! config('app.locale') !!}/admin/blog/{!! $post->slug !!}/content"> @endif
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1 @if (Auth::check()) class="jodelText" data-field="content01" @endif>{!! $post->content01 !!}</h1>
        {!! $post->published_at->format('Y') !!}
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div @if (Auth::check()) class="jodelTextarea" data-field="content03" @endif>{!! $post->content03 !!}</div>
      </div>
    </div>
  </div>
  @if (!Auth::check()) 
  <hr>
    <div class="container">
      <div class="col-lg-8 col-lg-offset-2 col-md-10 col-md-offset-1">
        @include('blog.disqus')
      </div>
    </div>
  <hr>
  @endif
@endsection