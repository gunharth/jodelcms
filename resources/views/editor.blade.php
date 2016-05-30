<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>Document</title>
	<link rel="stylesheet" href="/css/app.css">
	<link rel="stylesheet" href="/css/editor.css">
	<link rel="stylesheet" href="/font-awesome/css/font-awesome.css">
	<!--<link rel="stylesheet" href="/packages/nestable-fork/src/jquery.nestable.css">-->
</head>
<body>
	<iframe id="editorIFrame" src="/page/{{ $page->id}}/edit" frameborder="0" style="position: absolute; margin: 0; padding:0; width: 100%; height: 100%"></iframe>

<div id="inlinecms-panel" class="inlinecms" style="top: 161px; left: 54px; display: block;">
    <div class="title">
        <h3>jodelCMS</h3>
		<div class="toolbuttons">
			<a class="tb-collapse" href="#"><i class="fa fa-caret-up"></i></a>
			<a class="tb-logout" href="?exit"><i class="fa fa-times"></i></a>
		</div>
        <div class="lang">
            <select class="all-langs">
                <option value="en" selected="selected">EN</option>
            </select>
        </div>
    </div>
	<div class="body">
		<div id="tabs">
			<ul>
				<li  class="active"><a href="#tab-elements">Elements</a></li>
				<li><a href="#tab-pages">Pages</a></li>
				<li><a href="#tab-menus">Menus</a></li>
				<li><a href="#tab-settings" class="small"><i class="fa fa-gear"></i></a></li>
			</ul>
			<div id="tab-elements" class="tab">
				<div class="list">
					<ul><li data-id="text" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Text"><i class="fa fa-font"></i></li><li data-id="image" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Image"><i class="fa fa-picture-o"></i></li><li data-id="gallery" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Gallery"><i class="fa fa-th-large"></i></li><li data-id="video" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Video"><i class="fa fa-youtube-play"></i></li><li data-id="file" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="File"><i class="fa fa-download"></i></li><li data-id="form" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Contact Form"><i class="fa fa-envelope-o"></i></li><li data-id="map" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Map"><i class="fa fa-map-o"></i></li><li data-id="share" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Share Buttons"><i class="fa fa-share-alt"></i></li><li data-id="spacer" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Spacer"><i class="fa fa-arrows-v"></i></li><li data-id="code" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Code"><i class="fa fa-code"></i></li></ul>
				</div>
			</div>
			<div id="tab-pages" class="tab">
				<div class="buttons">
					<button class="btn-create" title="Create"><i class="fa fa-plus"></i></button>
					<button class="btn-open page-only" title="Open"><i class="fa fa-external-link"></i></button>
					<button class="btn-settings page-only" title="Settings"><i class="fa fa-gear"></i></button>
					<button class="btn-delete" title="Delete" disabled=""><i class="fa fa-times"></i></button>
				</div>
				<div id="inlinecms-pages-tree" class="pane jstree jstree-1 jstree-default" role="tree" tabindex="0" aria-activedescendant="n-index" aria-busy="false"><ul class="jstree-container-ul jstree-children jstree-wholerow-ul jstree-no-dots" role="group"><li role="treeitem" aria-selected="true" aria-level="1" aria-labelledby="n-index_anchor" id="n-index" class="jstree-node  jstree-leaf jstree-last"><div unselectable="on" role="presentation" class="jstree-wholerow jstree-wholerow-clicked">&nbsp;</div><i class="jstree-icon jstree-ocl" role="presentation"></i><a class="jstree-anchor jstree-clicked" href="#" tabindex="-1" id="n-index_anchor"><i class="jstree-icon jstree-themeicon fa fa-home jstree-themeicon-custom" role="presentation"></i>Home</a></li></ul></div>
			</div>
			<div id="tab-menus" class="tab">
				<div class="buttons">
					<button class="btn-create" title="Create"><i class="fa fa-plus"></i></button>
					<button class="btn-settings item-only" title="Settings" disabled=""><i class="fa fa-gear"></i></button>
					<button class="btn-delete item-only" title="Delete" disabled=""><i class="fa fa-times"></i></button>
					<span class="delimiter"></span>
					<button class="btn-move-up item-only" title="Move Up" disabled=""><i class="fa fa-arrow-up"></i></button>
					<button class="btn-move-down item-only" title="Move Down" disabled=""><i class="fa fa-arrow-down"></i></button>
				</div>
                <div id="inlinecms-menus-tree" class="pane jstree jstree-2 jstree-default jstree-leaf" role="tree" tabindex="0" aria-activedescendant="j2_loading" aria-busy="false">
					
					<div class="dd">
            <ol class="dd-list">
            @foreach(\App\Menue::all()->toHierarchy() as $node)
                    {!! renderNode($node) !!}
                @endforeach
               
            </ol>
        </div>


                </div>
			</div>
            <div id="tab-settings" class="tab">
                <ul class="links">
                    <li>
                        <i class="fa fa-fw fa-edit"></i>
                        <a class="s-layouts" href="#">Manage Layouts</a>
                    </li>
                    <li>
                        <i class="fa fa-fw fa-code"></i>
                        <a class="s-code" href="#">Global Code</a>
                    </li>
                    <li>
                        <i class="fa fa-fw fa-user"></i>
                        <a class="s-user" href="#">Administrator Profile</a>
                    </li>
                    <li>
                        <i class="fa fa-fw fa-envelope-o"></i>
                        <a class="s-mail" href="#">Mail Settings</a>
                    </li>
                                            <li>
                            <i class="fa fa-fw fa-cloud-download"></i>
                            <a class="s-updates" href="http://inlinecms.com/check-updates?v=1.0.0" target="_blank">Check for updates</a>
                        </li>
                                    </ul>
                <div id="core-version"><span>v1.0.0</span></div>
            </div>
		</div>
		<div id="save-buttons">
			<button id="savePage" class="btn-save"><i class="fa fa-fw fa-check"></i>Save</button>
			<button class="btn-save-and-exit"><i class="fa fa-fw fa-sign-out"></i>Save &amp; Exit			</button>
		</div>
	</div>
</div>
<div class="inlinecms-loading-indicator"><i class="fa fa-spinner fa-pulse"></i></div>

	
	<script src="/js/app.js"></script>
	<script src='/js/jquery-ui.js'></script>
	<script src="/packages/nestable-fork/src/jquery.nestable.js"></script>
	<script>
	$(function () {

      	$.ajaxSetup({
	        headers: {
	            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
	        }
		});
      	$('#savePage').on('click', function(e) {
      		e.preventDefault();
      		$('.inlinecms-loading-indicator').show();
        	$('#editorIFrame').get(0).contentWindow.savePage();
    	});

    	 
    	//this.restorePanelState = function(){
    	function restorePanelState() {
		var panel = $('#inlinecms-panel');
		var panelState = {};

		if (!localStorage.getItem("inlinecms-panel")){
			panelState = {
				position: {left: 50, top: 150},
				tab: '#tab-elements',
                expanded: true
			};
		} else {
			panelState = JSON.parse(localStorage.getItem("inlinecms-panel"))
		}

		panel.css(panelState.position);

		var a = $("#tabs a[href='"+panelState.tab+"']", panel);

		$('#tabs .active', panel).removeClass('active');
		$('#tabs '+a.attr('href'), panel).show();

		a.parent('li').addClass('active');

        if (!panelState.expanded){
            $('.body', panel).hide();
            $('.title .tb-collapse i', panel).toggleClass('fa-caret-up').toggleClass('fa-caret-down');
        }

	};

    	function savePanelState() {
    		var panel = $('#inlinecms-panel');
        var activeTab = $('#tabs .active', panel).length > 0 ?
                        $('#tabs .active a', panel).attr('href') :
                        $('#tabs a', panel).eq(0).attr('href');

		localStorage.setItem("inlinecms-panel", JSON.stringify({
			position: panel.position(),
			tab: activeTab,
            expanded: $('.body:visible', panel).length
		}));
	};

      	 function buildPanel() {

        var panel = $('#inlinecms-panel');

		panel.draggable({
            handle: ".title",
            iframeFix: true,
            stop: function(){
				savePanelState();
            }
        });

        $('.title .tb-collapse', panel).on('click', function(e){

			e.preventDefault();
			$('.body', panel).slideToggle(250, function(){
                savePanelState();
            });
			//$('i', this).toggleClass('fa-caret-up').toggleClass('fa-caret-down');
			return false;

        });

        $('.title', panel).on('dblclick', function(e){
            $('.tb-collapse', $(this)).click();
        });

        $('#tabs > ul > li > a', panel).on('click', function(e){
			e.preventDefault();
			var a = $(this);
			$('#inlinecms-panel #tabs ul li').removeClass('active');
			a.parent('li').addClass('active');
			$('#inlinecms-panel #tabs .tab').hide();
			$('#inlinecms-panel #tabs '+a.attr('href')).show();
			savePanelState();
			//return false;
		});
    };
buildPanel();
restorePanelState();


	$('.dd').nestable().on('change',function(){
                        $.ajax({
                            type: 'POST',
                            url: '/menue/sortorder',
                            data: JSON.stringify($('.dd').nestable('asNestedSet')),
                            contentType: "json",
                            /*headers: {
                                'X-CSRF-Token': $('meta[name="_token"]').attr('content')
                            },*/
                            error:  function (xhr, ajaxOptions, thrownError) {
                                console.log(xhr.status);
                                console.log(thrownError);
                            }
                        });
                    }
                );
	});

	
	</script>
</body>
</html>