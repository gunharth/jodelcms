@extends('layout')

@section('content')
    <div class="container">
      <div class="row"><h1 data-field="title">{{ $text->title }}</h1></div>
      <div class="row">
        <div class="col-md-6">
          <div class="mytextarea editable" data-field="content-left">{{ $text->contentLeft }}</div>
        </div>
        <div class="col-md-6">
          <div class="mytextarea" data-field="content-right">{{ $text->contentRight }}</div>
        </div>
      </div>
    </div><!-- /.container -->
@endsection
@section('scripts')
    <script src='/js/tinymce/tinymce.min.js'></script>
    <script>
      tinymce.init({
        selector: '.mytextarea',
        inline: true,
        plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak",
             "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
             "table contextmenu directionality emoticons paste textcolor responsivefilemanager code"
       ],
       toolbar1: "undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect",
       toolbar2: "| responsivefilemanager | link unlink anchor | image media | forecolor backcolor  | print preview code ",
       image_advtab: true ,
       
       external_filemanager_path:"/js/filemanager/",
       filemanager_title:"Filemanager" ,
       filemanager_access_key:"dsflFWR9u2xQa" ,
       external_plugins: { "filemanager" : "/js/filemanager/plugin.min.js"}

    });
    tinymce.init({
      selector: 'h1',
      inline: true,
      menubar: false,
      toolbar: false,


    });

    $(document).ready(function() {
      $('#savePage').on('click', function(e) {
          var data = {};
          e.preventDefault();
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
        url: "myfile.php",
        cache: false,
        method: 'GET',
        success: function(rsp) {
            alert(JSON.stringify(rsp));
        var Content = rsp;
        var Template = render('tsk_lst');
        var HTML = Template({ Content : Content });
        $( "#task_lists" ).html( HTML );
        }
    });
          //console.log(JSON.stringify(data));
      });
    });

  </script>
@endsection
