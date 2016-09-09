@extends('layout')

@section('meta_title'){{ $page->meta_title }}@endsection
@section('meta_description'){{ $page->meta_description }}@endsection
@section('meta_keywords'){{ $page->meta_keywords }}@endsection
@section('head_code'){{ $page->head_code }}@endsection
@section('body_start_code'){{ $page->body_start_code }}@endsection
@section('body_end_code'){{ $page->body_end_code }}@endsection

@section('templateStyles')
@endsection

@section('content')
  @if (Auth::check()) <input type="hidden" id="url" value="/{!! config('app.locale') !!}/admin/page/{!! $page->slug !!}/content"> @endif
  <div class="container">
    <div class="row">
      <div class="col-md-6">

        @foreach($page->regions as $region)
          @if($region->name == 'region01')
          <div class="jodelRegion" data-region-id="content">
            @foreach($region->elements as $element)
              <div @if (Auth::check()) class="jodelTextarea" data-field="{{ $element->id }}" @endif>{!! $element->content !!}</div>
            @endforeach
            </div>
          @endif
        @endforeach

      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
          
      </div>
      <div class="col-md-6">
          
        </div>
    </div>
  </div><!-- /.container -->
@endsection

@section('templateScripts')
@endsection