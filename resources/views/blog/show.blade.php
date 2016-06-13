@extends('layout')

@if (Auth::check())
@section('styles')
  <style>
    .jodelText, .jodelTextarea { outline: 1px dashed #27ae60; }
    .jodelText:hover, .jodelTextarea:hover { outline: 1px solid #27ae60;}
  </style>
@endsection
@endif

@section('content')
@if (Auth::check()) <input type="hidden" id="post_id" value="{!! $post->slug !!}"> @endif
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1 @if (Auth::check()) class="jodelText" data-field="title" @endif>{!! $post->title !!}</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div @if (Auth::check()) class="jodelTextarea" data-field="content" @endif>{!! $post->content !!}</div>
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
             "save autosave advlist autolink link image lists charmap print preview hr anchor pagebreak",
             "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
             "table contextmenu directionality emoticons paste textcolor code codesample"
       ],
       //toolbar1: "save | undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect",
       toolbar1: "save | undo redo | bold italic | alignleft aligncenter alignright alignjustify | styleselect",
       //toolbar2: "link unlink anchor | image media | forecolor backcolor  | print preview code ",
       toolbar2: "link unlink anchor | image media | forecolor backcolor | bullist numlist |code codesample",
       image_advtab: true ,
       
       file_browser_callback : elFinderBrowser,
       save_onsavecallback: function () { savePage(); }
       

    });

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

        var data = {};
        var post_id = $('#post_id').val();
          for (i=0; i < tinymce.editors.length; i++){
            var content = tinymce.editors[i].getContent();
            var field = document.getElementById(tinymce.editors[i].id).dataset.field;
            data[field] = content;
            //alert(field + ':' + content);
            //alert('Editor-Id(' + tinymce.editors[i].id + '):' + content);
          }
          $.ajax({
        dataType: "html",
        data: data,
        url: "/blog/"+post_id,
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
