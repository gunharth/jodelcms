<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>Document</title>
	<!--<link rel="stylesheet" href="/css/app.css">-->
	<link rel="stylesheet" href="/css/jquery-ui.css">
	<link rel="stylesheet" href="/css/superhero.css">
	<!--<link rel="stylesheet" href="/css/editor.css">-->
	<link rel="stylesheet" href="/font-awesome/css/font-awesome.css">
	<!--<link rel="stylesheet" href="/packages/nestable-fork/src/jquery.nestable.css">-->
	<style>
		
*:focus {outline: none;}
		body { background: transparent; }


		#editor-panel {     
			right: auto;
    		bottom: auto; 
    		top: 161px; 
    		left: 410px; 
    		display: block;
    		z-index: 50;
    	}
    	#editor-panel button:focus {
  outline: none;
}
    	#editor-panel .modal-dialog {     
			margin: 10px;
			width: 400px;
    	}
    	#editor-panel .modal-content {     
			-webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
    		box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);
    		border-radius: 6px;
    	}
    	#editor-panel .modal-header, #editor-panel .modal-footer {
		    border-radius: 6px;
		}
		#editor-panel .modal-header:hover {
		    cursor: move;
		}
		#editor-panel .tab { display: none; }

		#editor-panel button { border-radius: 4px; }
		#editor-panel #tabs .buttons { padding-bottom: 5px; }

		.dd { position: relative; display: block; margin: 0; padding: 0; max-width: 600px; list-style: none; font-size: 13px; line-height: 20px; }

.dd-list { display: block; position: relative; margin: 0; padding: 0; list-style: none; }
.dd-list .dd-list { padding-left: 30px; }
.dd-collapsed .dd-list { display: none; }

.dd-item,
.dd-empty,
.dd-placeholder { display: block; position: relative; margin: 0; padding: 0; min-height: 20px; font-size: 13px; line-height: 20px; }


.dd-handle:hover { color: #2ea8e5; background: #fff; }

.dd-item > button { display: block; position: relative; cursor: pointer; float: left; width: 25px; height: 20px; margin: 5px 0; padding: 0; text-indent: 100%; white-space: nowrap; overflow: hidden; border: 0; background: transparent; font-size: 12px; line-height: 1; text-align: center; font-weight: bold; }
.dd-item > button:before { content: '+'; display: block; position: absolute; width: 100%; text-align: center; text-indent: 0; }
.dd-item > button[data-action="collapse"]:before { content: '-'; }

.dd-placeholder,
.dd-empty { margin: 5px 0; padding: 0; min-height: 30px; background: #f2fbff; border: 1px dashed #b6bcbf; box-sizing: border-box; -moz-box-sizing: border-box; }
.dd-empty { border: 1px dashed #bbb; min-height: 100px; background-color: #e5e5e5;
    background-image: -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff),
                      -webkit-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
    background-image:    -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff),
                         -moz-linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
    background-image:         linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff),
                              linear-gradient(45deg, #fff 25%, transparent 25%, transparent 75%, #fff 75%, #fff);
    background-size: 60px 60px;
    background-position: 0 0, 30px 30px;
}

.dd-dragel { position: absolute; pointer-events: none; z-index: 9999; }
.dd-dragel > .dd-item .dd-handle { margin-top: 0; }
.dd-dragel .dd-handle {
    -webkit-box-shadow: 2px 4px 6px 0 rgba(0,0,0,.1);
            box-shadow: 2px 4px 6px 0 rgba(0,0,0,.1);
}

/**
 * Nestable Extras
 */

.nestable-lists { display: block; clear: both; padding: 30px 0; width: 100%; border: 0; border-top: 2px solid #ddd; border-bottom: 2px solid #ddd; }

#nestable-menu { padding: 0; margin: 20px 0; }

#nestable-output,
#nestable2-output { width: 100%; height: 7em; font-size: 0.75em; line-height: 1.333333em; font-family: Consolas, monospace; padding: 5px; box-sizing: border-box; -moz-box-sizing: border-box; }

#nestable2 .dd-handle {
    color: #fff;
    border: 1px solid #999;
    background: #bbb;
    background: -webkit-linear-gradient(top, #bbb 0%, #999 100%);
    background:    -moz-linear-gradient(top, #bbb 0%, #999 100%);
    background:         linear-gradient(top, #bbb 0%, #999 100%);
}
#nestable2 .dd-handle:hover { background: #bbb; }
#nestable2 .dd-item > button:before { color: #fff; }

@media only screen and (min-width: 700px) {

    .dd { width: 100%; }
    .dd + .dd { margin-left: 2%; }

}

.dd-hover > .dd-handle { background: #2ea8e5 !important; }

/**
 * Nestable Draggable Handles
 */

.dd-content { display: block; height: 31px; margin: 5px 0; padding: 5px 10px 5px 40px; color: #333; text-decoration: none; border: 1px solid #ccc;
    background: #fafafa;
    background: -webkit-linear-gradient(top, #fafafa 0%, #eee 100%);
    background:    -moz-linear-gradient(top, #fafafa 0%, #eee 100%);
    background:         linear-gradient(top, #fafafa 0%, #eee 100%);
    -webkit-border-radius: 3px;
            border-radius: 3px;
    box-sizing: border-box; -moz-box-sizing: border-box;
}
.dd-content:hover { color: #2ea8e5; background: #fff; }

.dd-dragel > .dd-item > .dd-content { margin: 0; }

.dd-item > button { margin-left: 30px; }

.dd-handle { 
	position: absolute;
	display: block; 
	height: 30px;
	margin: 0; 
	padding: 4px 8px;
	left: 0; 
	top: 0; c
	ursor: pointer; 
	width: 30px; 
	white-space: nowrap; 
	overflow: hidden;
    border: 1px solid #aaa;
    background: #ddd;
    background: -webkit-linear-gradient(top, #ddd 0%, #bbb 100%);
    background:    -moz-linear-gradient(top, #ddd 0%, #bbb 100%);
    background:         linear-gradient(top, #ddd 0%, #bbb 100%);
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.dd-handle:hover { background: #ddd; }

#editor-loading {
	position:absolute;
	left:50%;
	top:50%;
	margin-left:-50px;
	margin-top:-50px;
	width:100px;
	height:100px;
	line-height:100px;
	background:rgba(44,62,80,.85);
	color:#FFF;
	font-size:60px;
	text-align:center;
	border-radius:15px;
	display:none;
	z-index: 51;
	}

	</style>
</head>
<body>
	<iframe id="editorIFrame" src="/page/{{ $page->id}}/edit" frameborder="0" style="position: absolute; margin: 0; padding:0; width: 100%; height: 100%;"></iframe>
<div id="editor-panel" class="modal">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <!--<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>-->
        <div class="col-sm-6">
        <h4 class="modal-title">jodelCMS</h4>
        </div>
        <div class="col-sm-2">
            <!--<select class="all-langs">
                <option value="en" selected="selected">EN</option>
            </select>-->
        </div>
        <div class="col-sm-4 text-right">
			<a class="tb-collapse" href="#"><i class="fa fa-fw fa-caret-up"></i></a>
			<a class="tb-logout" href="?exit"><i class="fa fa-times"></i></a>
		</div>
        
      </div>
      <div id="modal-toggle">
      <div class="modal-body">
        <div id="tabs">
			<ul class="list-inline">
				<li class="active"><a href="#tab-elements">Elements</a></li>
				<li><a href="#tab-pages">Pages</a></li>
				<li><a href="#tab-menus">Menus</a></li>
				<li><a href="#tab-settings"><i class="fa fa-gear"></i></a></li>
			</ul>
			<div id="tab-elements" class="tab">
				<div class="list">
					<ul><li data-id="text" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Text"><i class="fa fa-font"></i></li><li data-id="image" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Image"><i class="fa fa-picture-o"></i></li><li data-id="gallery" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Gallery"><i class="fa fa-th-large"></i></li><li data-id="video" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Video"><i class="fa fa-youtube-play"></i></li><li data-id="file" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="File"><i class="fa fa-download"></i></li><li data-id="form" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Contact Form"><i class="fa fa-envelope-o"></i></li><li data-id="map" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Map"><i class="fa fa-map-o"></i></li><li data-id="share" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Share Buttons"><i class="fa fa-share-alt"></i></li><li data-id="spacer" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Spacer"><i class="fa fa-arrows-v"></i></li><li data-id="code" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Code"><i class="fa fa-code"></i></li></ul>
				</div>
			</div>
			<div id="tab-pages" class="tab">
				<div class="buttons">
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>
				<div class="dd">
		            <ol class="dd-list">
		            	@foreach(\App\Page::all() as $page)
		                    {!! renderPage($page) !!}
		                @endforeach
		            </ol>
		        </div> 
			</div>
			<div id="tab-menus" class="tab">
				<div class="buttons">
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>
				<div class="dd">
		            <ol class="dd-list">
		            	@foreach(\App\Menue::all()->toHierarchy() as $node)
		                    {!! renderNode($node) !!}
		                @endforeach
		            </ol>
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
		</div><!-- tabs end -->
      </div>
      <div id="save-buttons" class="modal-footer">
        <button id="savePage" type="button" class="btn btn-primary"><i class="fa fa-fw fa-check"></i>Save</button>
        <button type="button" class="btn btn-primary"><i class="fa fa-fw fa-sign-out"></i>Save &amp; Exit</button>
      </div>
      </div>
    </div>
  </div>
</div>

<div id="editor-loading"><i class="fa fa-spinner fa-pulse"></i></div>

<div id="dialog-form" title="Create new user">
  <p class="validateTips">All form fields are required.</p>
 	
 	{!! Form::open([
            'route' => ['page.store'],
            'class' => 'form-horizontal'
        ]) !!}
	  <div class="form-group">
	    {!! Form::label('title','Title',['class' => 'col-sm-2']) !!}
	    <div class="col-sm-10">
	    {!! Form::text('title',null,['class' => 'form-control', 'placeholder' => 'Page Title']) !!}
	    </div>
	</div>
	<div class="form-group">
	    {!! Form::submit('Save',['class' => 'btn btn-primary']) !!}
	</div>
	{!! Form::close() !!}

</div>
	
	<script src="/js/app.js"></script>
	<script src='/js/jquery-ui.js'></script>
	<script src="/packages/nestable-fork/src/jquery.nestable.js"></script>
	<script>
		"use strict";
	class Editor {

		constructor() {
			this.editorPanel = $('#editor-panel');
			this.editorPanelCollapse = $('#modal-toggle');
			this.dialog = $( "#dialog-form" );
		}
	
		initPanel() {
			$.ajaxSetup({
		        headers: {
		            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		        }
			});

			this.editorPanel.draggable({
	            handle: ".modal-header",
	            iframeFix: true,
	            cursor: "move",
	            containment: "document",
	            stop: ()=> {
	            	this.savePanelState();
	            	this.editorPanel.css({height: 'auto'});
	            }
	        });
	        //this.restorePanelState();

	        $('.modal-header .tb-collapse', this.editorPanel).on('click', (e)=>{
				e.preventDefault();
				this.editorPanelCollapse.slideToggle(250, ()=>{
	                this.savePanelState();
	            });
				$('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
	        });

			$( "#tabs" ).tabs({
				activate: ( event, ui ) => {
					this.savePanelState();
				},
				create:  ( event, ui ) => {
					this.restorePanelState();
				}
			});

			
 
    

			
		    $('#tab-pages .btn-create', this.editorPanel).on('click', (e)=>{
		        	e.preventDefault();
		        	//this.addPage();
		        	this.dialog.dialog({
      autoOpen: false,
      height: 300,
      width: 350,
      modal: true,
      buttons: {
        "Create an account": this.addPage(),
        Cancel: () => {
          this.dialog.dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
        allFields.removeClass( "ui-state-error" );
      }
    });
		        	this.dialog.dialog( "open" );
			});
			

	        $('#savePage').on('click', (e)=> {
	      		e.preventDefault();
	      		$('#editor-loading').show();
	        	$('#editorIFrame').get(0).contentWindow.savePage();
	    	});

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
		}

		savePanelState() {
	        /*var activeTab = $('#tabs .ui-state-active', this.editorPanel).length > 0 ?
	                        $('#tabs .ui-state-active a', this.editorPanel).attr('href') :
	                        $('#tabs a', this.editorPanel).eq(0).attr('href');*/

	        let activeTab = $('#tabs').tabs( "option", "active" );

			localStorage.setItem("editor-panel", JSON.stringify({
				position: this.editorPanel.position(),
				tab: activeTab,
	            expanded: $('#modal-toggle:visible', this.editorPanel).length
			}));
		};

		restorePanelState() {
			let panelState = {};
			if (!localStorage.getItem("editor-panel")){
				panelState = {
					position: {left: 50, top: 150},
					tab: '#tab-elements',
	                expanded: true
				};
			} else {
				panelState = JSON.parse(localStorage.getItem("editor-panel"))
			}
			this.editorPanel.css(panelState.position);
			$('#tabs').tabs( "option", "active", panelState.tab );
			/*var a = $("#tabs a[href='"+panelState.tab+"']", this.editorPanel);
			$('#tabs .active', this.editorPanel).removeClass('active');
			$('#tabs '+a.attr('href'), this.editorPanel).show();
			a.parent('li').addClass('active');*/
	        if (!panelState.expanded){
	            this.editorPanelCollapse.hide();
	            $('.modal-header .tb-collapse i').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
	        }
		};

		addPage() {
			console.log('xp')
		};
	
	}
	$(function () {

		let editor = new Editor();
		editor.initPanel();


	});

	//$(function () {
      	
      	/*$('#savePage').on('click', function(e) {
      		e.preventDefault();
      		$('#editor-loading').show();
        	$('#editorIFrame').get(0).contentWindow.savePage();
    	});*/

    	/*$('.dd').nestable().on('change',function(){
                        $.ajax({
                            type: 'POST',
                            url: '/menue/sortorder',
                            data: JSON.stringify($('.dd').nestable('asNestedSet')),
                            contentType: "json",
                           
                            error:  function (xhr, ajaxOptions, thrownError) {
                                console.log(xhr.status);
                                console.log(thrownError);
                            }
                        });
                    }
                );
});*/

    	 
    	//this.restorePanelState = function(){
  /*  	function restorePanelState() {
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
restorePanelState();*/


	
	

	
	</script>
</body>
</html>