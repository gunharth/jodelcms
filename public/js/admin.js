$(function() {
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });
    $('title', window.parent.document).text($('title').text());
});

$(document).keydown((e) => {
    if ((e.ctrlKey || e.metaKey) && e.which == 83) {
        e.preventDefault();
        saveContent();
    }
});

function initTinyMCE(selector) {

    tinymce.init({
        selector: selector,
        inline: true,
        menubar: false,
        plugins: [
            "advlist autolink link image imagetools lists charmap print preview hr anchor pagebreak",
            "searchreplace wordcount visualblocks visualchars insertdatetime media nonbreaking",
            "table contextmenu directionality emoticons paste textcolor code codesample"
        ],
        //toolbar1: "save | undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | styleselect",
        toolbar1: "undo redo | bold italic | alignleft aligncenter alignright alignjustify | styleselect",
        //toolbar2: "link unlink anchor | image media | forecolor backcolor  | print preview code ",
        toolbar2: "link unlink anchor | image media | forecolor backcolor | bullist numlist |code codesample",
        image_advtab: true,
        image_dimensions: false,
        file_browser_callback: elFinderBrowser,
        //save_onsavecallback: function() { saveContent(); },
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
            ed.on('init', function(e) {
                setModalEvents(ed);
            });
        }
    });
}


function tinyMceChange(ed) {
    $(ed.targetElm).parent().addClass('has-changed');
}

function setModalEvents(ed) {
    ed.windowManager.oldOpen = ed.windowManager.open; // save for later
    ed.windowManager.open = function(t, r) {
        $('#editor-panel', window.parent.document).fadeOut();
        var modal = this.oldOpen.apply(this, [t, r]);
        modal.on('close', function() {
            setTimeout(function() {
                if ($('#mce-modal-block').length == 0) {
                    $('#editor-panel', window.parent.document).fadeIn();
                }
            }, 300);
        });
        return modal; // Template plugin is dependent on this return value
    };
}

function elFinderBrowser(field_name, url, type, win) {
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

function saveContent() {
    $('#editor-loading', window.parent.document).show();
    var data = { '_method': 'patch' };
    data['lang'] = $('html').attr('lang');
    var elements = {};
    var url = $('#url').val();
    var elms = 0;
    if (tinymce.editors.length) {
        for (i = 0; i < tinymce.editors.length; i++) {
            var content = tinymce.editors[i].getContent();
            var element = document.getElementById(tinymce.editors[i].id).dataset.field;
            elements[i] = { 'id': element, 'content': content, 'options': '' };
            elms++;
        }
    }

    $('.jodelcms-element').each(function() {
        var element_type = $(this).attr('data-type');
        if (element_type !== 'text') {
            var element_id = $(this).attr('id');
            var eid = element_id.replace('element_', '');
            var content = '';
            if (element_type !== 'form' && element_type !== 'map') {
                content = $(this).find('.jodelcms-content').html();
            }
            elements[elms] = { 'id': eid, 'content': content, 'options': JSON.stringify(options[element_id]) };
            elms++;
        }
    });

    data['elements'] = elements;

    $.ajax({
        dataType: 'json',
        data: data,
        url: url,
        cache: false,
        method: 'POST',
        success: function(data) {
            setTimeout(function() {
                $('#editor-loading', window.parent.document).hide();
                window.parent.editor.isGoogleMapsApiLoaded = false;
                document.location.reload();
            }, 500);
        }
    });
}
