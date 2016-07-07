$(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $('a[target!=_blank]').attr('target', '_top');
    $('title', window.parent.document).text($('title').text());
});

tinymce.init({
    selector: '.jodelText',
    inline: true,
    menubar: false,
    toolbar: false,
    plugins: [
        "save autosave"
    ],
    toolbar1: "save | undo redo",
    save_onsavecallback: function() { savePage(); },
    setup: function(ed) {
        ed.on('keyup', function(e) {
            tinyMceChange(ed);
        });
        ed.on('change', function(e) {
            tinyMceChange(ed);
        });
    }
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
    image_advtab: true,
    image_dimensions: false,
    file_browser_callback: elFinderBrowser,
    save_onsavecallback: function() { savePage(); },
    video_template_callback: function(data) {
        return '<video' + (data.poster ? ' poster="' + data.poster + '"' : '') + ' controls="controls" data-type="test">\n' + '<source src="' + data.source1 + '"' + (data.source1mime ? ' type="' + data.source1mime + '"' : '') + ' />\n' + (data.source2 ? '<source src="' + data.source2 + '"' + (data.source2mime ? ' type="' + data.source2mime + '"' : '') + ' />\n' : '') + '</video>';
    },
    setup: function(ed) {
        ed.on('keyup', function(e) {
            tinyMceChange(ed);
        });
        ed.on('change', function(e) {
            tinyMceChange(ed);
        });
    }
});

function tinyMceChange(ed) {
    $(ed.targetElm).addClass('has-changed');
}

function elFinderBrowser(field_name, url, type, win) {
    console.log(type);
    tinymce.activeEditor.windowManager.open({
        file: '/elfinder/tinymce4', // use an absolute path!
        title: 'Files',
        width: 900,
        height: 600,
        resizable: 'yes',
    }, {
        setUrl: function(url) {
            win.document.getElementById(field_name).value = url;
        }
    });
    return false;
}

function savePage() {
    $('#editor-loading', window.parent.document).show();
    var data = { '_method': 'patch' };
    var page_id = $('#page_id').val();
    for (i = 0; i < tinymce.editors.length; i++) {
        var content = tinymce.editors[i].getContent();
        var field = document.getElementById(tinymce.editors[i].id).dataset.field;
        data[field] = content;
    }
    $.ajax({
        dataType: 'json',
        data: data,
        url: '/admin/page/' + page_id + '/content',
        cache: false,
        method: 'POST',
        success: function(data) {
            setTimeout(function() {
                $('#editor-loading', window.parent.document).hide();
                document.location.reload();
            }, 500);
        }
    });
}