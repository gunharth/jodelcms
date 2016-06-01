@extends('layout')

@section('content')
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h1 class="editable" data-field="title">{!! $page->title !!}</h1>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <div class="mytextarea editable" data-field="contentLeft">
          {!! $page->contentLeft !!}
          </div>
        </div>
        <div class="col-md-6">
          <div class="mytextarea editable" data-field="contentRight">{!! $page->contentRight !!}</div>
        </div>
      </div>
    </div><!-- /.container -->
@endsection

@section('scripts')
    <script src='/js/tinymce/tinymce.min.js'></script>
    <script>
      
      tinymce.init({
        selector: 'h1',
        inline: true,
        menubar: false,
        toolbar: false,
      });

      tinymce.init({
        selector: '.mytextarea',
        inline: true,
        plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak",
             "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
             "table contextmenu directionality emoticons paste textcolor code"
       ],
       toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect",
       toolbar2: "link unlink anchor | image media | forecolor backcolor  | print preview code ",
       image_advtab: true ,
       
       file_browser_callback : elFinderBrowser,
       setup: function(ed) {
      ed.on('Change Undo Redo', logDirty);
    }

    });

      function setNotDirty() {
    tinymce.activeEditor.isNotDirty = true;
    logDirty();
  }
  function logDirty() {
    var isDirty = tinymce.activeEditor.isDirty();
    //tinymce.$('#status').text('isDirty: ' + isDirty);
    console.log('isDirty: ' + isDirty);
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
      
    });

    function savePage() {
      var data = {};
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
        url: "/page/1",
        cache: false,
        method: 'POST',
        success: function(data) {
            //return data;
            //alert(data);
            // make something green!!!
            setTimeout(function(){
                $('#editor-loading', window.parent.document).hide();
            },1000);
            
        }
    });
    }

  </script>
@endsection