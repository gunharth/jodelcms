<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>elFinder 2.0</title>

    <!-- jQuery and jQuery UI (REQUIRED) -->
    <link rel="stylesheet" href="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/themes/smoothness/jquery-ui.css" />
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.4/jquery-ui.min.js"></script>

    <!-- elFinder CSS (REQUIRED) -->
    <link rel="stylesheet" type="text/css" href="<?= asset($dir.'/css/elfinder.min.css') ?>">
    <link rel="stylesheet" type="text/css" href="<?= asset($dir.'/css/theme.css') ?>">
    <!-- bootstrap theme https://github.com/StudioJunkyard/LibreICONS/tree/master/themes/elFinder -->
    <link rel="stylesheet" type="text/css" href="<?= asset($dir.'/css/theme-bootstrap-libreicons-svg.css') ?>">

    <!-- elFinder JS (REQUIRED) -->
    <script src="<?= asset($dir.'/js/elfinder.min.js') ?>"></script>

    <?php if($locale){ ?>
        <!-- elFinder translation (OPTIONAL) -->
        <script src="<?= asset($dir."/js/i18n/elfinder.$locale.js") ?>"></script>
    <?php } ?>
    
    <!-- elFinder initialization (REQUIRED) -->
    <script type="text/javascript">
        var FileBrowserDialogue = {
            init: function() {
                // Here goes your code for setting your custom things onLoad.
            },
            mySubmit: function (URL) {
                // pass selected file path to TinyMCE
                parent.tinymce.activeEditor.windowManager.getParams().setUrl(URL);

                // close popup window
                parent.tinymce.activeEditor.windowManager.close();
            }
        }

        $().ready(function() {
            
            // commands : [
            //     'open', 'reload', 'home', 'up', 'back', 'forward', 'getfile', 'quicklook', 
            //     'download', 'rm', 'duplicate', 'rename', 'mkdir', 'mkfile', 'upload', 'copy', 
            //     'cut', 'paste', 'edit', 'extract', 'archive', 'search', 'info', 'view', 'help',
            //     'resize', 'sort'
            // ]

            // say you want to disable only a couple of commands
            // var myCommands = elFinder.prototype._options.commands;
            // var disabled = ['extract', 'archive', 'help', 'sort', 'info'];
            // $.each(disabled, function(i, cmd) {
            //     (idx = $.inArray(cmd, myCommands)) !== -1 && myCommands.splice(idx,1);
            // });

            var elf = $('#elfinder').elfinder({
                // set your elFinder options here
                defaultView : 'list',
                resizable : false,
                height: 598,
                uiOptions: {
                    toolbar : [
                        ['back', 'forward'],
                        // ['reload'],
                        // ['home', 'up'],
                        ['mkdir', 'mkfile', 'upload'],
                        ['open', 'download', 'getfile'],
                        //['info'],
                        ['quicklook'],
                        ['copy', 'cut', 'paste'],
                        ['rm'],
                        ['duplicate', 'rename', 'edit', 'resize'],
                        //['extract', 'archive'],
                        //['search'],
                        ['view'],
                        ['help']
                    ],
                    cwd : {
                        // display parent folder with ".." name :)
                        oldSchool : false,
                        
                        // fm.UA types array to show item select checkboxes e.g. ['All'] or ['Mobile'] etc. default: ['Touch']
                        showSelectCheckboxUA : ['Touch'],
                        
                        // file info columns displayed
                        listView : {
                            // name is always displayed, cols are ordered
                            // e.g. ['perm', 'date', 'size', 'kind', 'owner', 'group', 'mode']
                            // mode: 'mode'(by `fileModeStyle` setting), 'modestr'(rwxr-xr-x) , 'modeoct'(755), 'modeboth'(rwxr-xr-x (755))
                            // 'owner', 'group' and 'mode', It's necessary set volume driver option "statOwner" to `true`
                            // for custom, characters that can be used in the name is `a-z0-9_`
                            columns : ['kind', 'size', 'date'],
                            // override this if you want custom columns name
                            // example
                            // columnsCustomName : {
                            //      date : 'Last modification',
                            //      kind : 'Mime type'
                            // }
                            columnsCustomName : {},
                            // fixed list header colmun
                            fixedHeader : true
                        }

                        // /**
                        //  * Add CSS class name to cwd directories (optional)
                        //  * see: https://github.com/Studio-42/elFinder/pull/1061,
                        //  *      https://github.com/Studio-42/elFinder/issues/1231
                        //  * 
                        //  * @type Function
                        //  */
                        // ,
                        // getClass: function(file) {
                        //  // e.g. This adds the directory's name (lowercase) with prefix as a CSS class
                        //  return 'elfinder-cwd-' + file.name.replace(/[ "]/g, '').toLowerCase();
                        //}
                        
                        //,
                        //// Template placeholders replacement rules for overwrite. see ui/cwd.js replacement
                        //replacement : {
                        //  tooltip : function(f, fm) {
                        //      var list = fm.viewType == 'list', // current view type
                        //          query = fm.searchStatus.state == 2, // is in search results
                        //          title = fm.formatDate(f) + (f.size > 0 ? ' ('+fm.formatSize(f.size)+')' : ''),
                        //          info  = '';
                        //      if (query && f.path) {
                        //          info = fm.escape(f.path.replace(/\/[^\/]*$/, ''));
                        //      } else {
                        //          info = f.tooltip? fm.escape(f.tooltip).replace(/\r/g, '&#13;') : '';
                        //      }
                        //      if (list) {
                        //          info += (info? '&#13;' : '') + fm.escape(f.name);
                        //      }
                        //      return info? info + '&#13;' + title : title;
                        //  }
                        //}
                    }

                },
                contextmenu : {
                // navbarfolder menu
                navbar : [],
                // current directory menu
                cwd    : [],
                // current directory file menu
                files  : []
                },
                <?php if($locale){ ?>
                    lang: '<?= $locale ?>', // locale
                <?php } ?>
                customData: { 
                    _token: '<?= csrf_token() ?>'
                },
                url: '<?= route("elfinder.connector") ?>',  // connector URL
                getFileCallback: function(file) { // editor callback
                    FileBrowserDialogue.mySubmit(file.url); // pass selected file path to TinyMCE
                }
            }).elfinder('instance');
        });
    </script>
</head>
<body>
    <!-- Element where elFinder will be created (REQUIRED) -->
    <div id="elfinder"></div>
</body>
</html>
