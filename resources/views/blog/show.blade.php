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
      <div class="col-md-12">
        {!! templateRegion($post, 'region-1') !!}
        {!! $post->published_at->format('d.m.Y') !!}
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        {!! templateRegion($post, 'region-2') !!}
      </div>
    </div>
      
    <div class="row">
      <div class="col-md-6">@if (!empty($post->prev)) <a href="/blog/{!! $post->prev->slug !!}">PREVIOUS POST<br> {!! $post->prev->content01 !!}</a>@endif</div>
      <div class="col-md-6 text-right">@if (!empty($post->next)) <a href="/blog/{!! $post->next->slug !!}">NEXT POST<br> {!! $post->next->content01 !!}</a>@endif</div>
    </div>

    @if (Auth::check()) 
      <div class="row">
       <div class="col-md-12">
       <h2>Description for Blog Home</h2>
        {!! templateRegion($post, 'region-3') !!}
      </div>
      </div>
    @endif

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