@extends('layout')

@section('meta_title'){{ $page->meta_title }}@endsection
@section('meta_description'){{ $page->meta_description }}@endsection
@section('meta_keywords'){{ $page->meta_keywords }}@endsection
@section('head_code'){{ $page->head_code }}@endsection
@section('body_start_code'){{ $page->body_start_code }}@endsection
@section('body_end_code'){{ $page->body_end_code }}@endsection

@section('content')
  @if (Auth::check()) <input type="hidden" id="url" value="/{!! config('app.locale') !!}/admin/page/{!! $page->slug !!}/content"> @endif
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1 @if (Auth::check()) class="jodelText" data-field="content01" @endif>{!! $page->content01 !!}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
          <div @if (Auth::check()) class="jodelTextarea" data-field="content02" @endif>{!! $page->content02 !!}</div>
      </div>
    </div>
  </div><!-- /.container -->

<div class="inlinecms-region" data-region-id="content">
dfsdf
 


</div>


@endsection