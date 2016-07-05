@extends('layout')

@section('meta_title'){{ $page->meta_title }}@endsection
@section('meta_description'){{ $page->meta_description }}@endsection
@section('meta_keywords'){{ $page->meta_keywords }}@endsection
@section('head_code'){{ $page->head_code }}@endsection
@section('body_start_code'){{ $page->body_start_code }}@endsection
@section('body_end_code'){{ $page->body_end_code }}@endsection

@if (Auth::check())
  @section('styles')
    <style>
      .jodelText, .jodelTextarea { outline: 1px dashed #27ae60; }
      .jodelText:hover, .jodelTextarea:hover { outline: 1px solid #27ae60;}
    </style>
  @endsection
@endif

@section('content')
@foreach($page->menu as $menu)
Menu id {!! $menu->id !!}
@endforeach

@if (Auth::check()) <input type="hidden" id="page_id" value="{!! $page->slug !!}"> @endif
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1 @if (Auth::check()) class="jodelText" data-field="content01" @endif>{!! $page->content01 !!}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
          <div @if (Auth::check()) class="jodelTextarea" data-field="content02" @endif>{!! $page->content02 !!}</div>
      </div>
      <div class="col-md-6">
          <div @if (Auth::check()) class="jodelTextarea" data-field="content03" @endif>{!! $page->content03 !!}</div>
        </div>
    </div>
  </div><!-- /.container -->
@endsection

@if (Auth::check())
@section('scripts')
    <script src='/js/tinymce/tinymce.min.js'></script>
    <script>
      
      tinymce.init({
        selector: '.jodelText',
        inline: true,
        menubar: false,
        toolbar: false,
        plugins: [
             "save autosave"
       ],
       toolbar1: "save | undo redo",
       save_onsavecallback: function () { savePage(); }
      });

      tinymce.init({
        selector: '.jodelTextarea',
        inline: true,
        menubar: false,
        plugins: [
             "save autosave advlist autolink link image imagetools lists charmap print preview hr anchor pagebreak",
             "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
             "table contextmenu directionality emoticons paste textcolor code codesample"
       ],
       //toolbar1: "save | undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect",
       toolbar1: "save | undo redo | bold italic | alignleft aligncenter alignright alignjustify | styleselect",
       //toolbar2: "link unlink anchor | image media | forecolor backcolor  | print preview code ",
       toolbar2: "link unlink anchor | image media | forecolor backcolor | bullist numlist |code codesample",
       image_advtab: true ,
       image_dimensions: false,
       file_browser_callback : elFinderBrowser,
       save_onsavecallback: function () { savePage(); },
       video_template_callback: function(data) {
   return '<video' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls" data-type="test">\n' + '<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + (data.source2 ? '<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</video>';
 },
       setup : function(ed){
         /*ed.on('NodeChange', function(e){
             console.log('the event object ' + e);
             console.log('the editor object ' + ed);
             console.log('the content ' + ed.getContent());
         });*/
         ed.on('keyup', function (e) {
            tinyMceChange(ed);
        });
        ed.on('change', function(e) {
            tinyMceChange(ed);
        });
    }
       

    });

      function tinyMceChange(ed) {
    console.debug('Editor contents was modified. Contents: ' + ed.getContent());
}

      function elFinderBrowser (field_name, url, type, win) {
        console.log(type);
        tinymce.activeEditor.windowManager.open({
          file: '<?= route('elfinder.tinymce4') ?>',// use an absolute path!
          title: 'Files',
          width: 900,
          height: 600,
          resizable: 'yes',

        }, {
          setUrl: function (url) {
            win.document.getElementById(field_name).value = url;
          }
        });
        return false;
      }



    $(document).ready(function() {

      $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
      });

      $('a[target!=_blank]').attr('target', '_top');


      
      
    });

function savePage() {
      
      $('#editor-loading', window.parent.document).show();

        var data = {'_method': 'patch' };
        var page_id = $('#page_id').val();
        for (i=0; i < tinymce.editors.length; i++){
          var content = tinymce.editors[i].getContent();
          var field = document.getElementById(tinymce.editors[i].id).dataset.field;
          data[field] = content;
          //alert(field + ':' + content);
          //alert('Editor-Id(' + tinymce.editors[i].id + '):' + content);
        }
        $.ajax({
            dataType: "json",
            data: data,
            url: "/admin/page/"+page_id,
            cache: false,
            method: 'POST',
            success: function(data) {
                // make something green!!!
                setTimeout(function(){
                    $('#editor-loading', window.parent.document).hide();
                    document.location.reload();
                },500);
                
            }
        });
    }
    

  </script>
@endsection
@endif

