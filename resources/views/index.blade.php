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

        @foreach($page->regions as $region)
          @if($region->name == 'region01')
            @foreach($region->elements as $element)
              <div @if (Auth::check()) class="jodelTextarea" data-field="{{ $element->id }}" @endif>{!! $element->content !!}</div>
            @endforeach
          @endif
        @endforeach

      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
          
      </div>
    </div>
  </div><!-- /.container -->

<div class="inlinecms-region" data-region-id="content">
dfsdf
 


</div>


@endsection