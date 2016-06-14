<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<title>jodelCMS</title>
	<link rel="stylesheet" href="/css/jquery-ui.css">
	<link rel="stylesheet" href="/css/superhero.css">
	<link rel="stylesheet" href="/css/editor.css">
	<link rel="stylesheet" href="/font-awesome/css/font-awesome.css">
</head>
<body>
	<iframe id="editorIFrame" name="editorIFrame" src="{{ $src }}" frameborder="0" style="position: absolute; margin: 0; padding:0; width: 100%; height: 100%;"></iframe>
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
			<a class="tb-collapse" href="#" title="Toggle"><i class="fa fa-fw fa-lg fa-caret-up"></i></a>
			<a href="/logout" title="Sign out"><i class="fa fa-lg fa-sign-out"></i></a>
		</div>
        
      </div>
      <div id="modal-toggle">
      <div class="modal-body">
        <div id="tabs">
			<ul class="list-inline">
				<!--<li><a href="#tab-elements">Elements</a></li>-->
				<li><a href="#tab-pages">Pages</a></li>
				<li><a href="#tab-menus">Menus</a></li>
				<li><a href="#tab-collections">Collections</a></li>
				<li><a href="#tab-settings"><i class="fa fa-gear"></i></a></li>
			</ul>
			<!--<div id="tab-elements" class="tab">
				<div class="list">
					<ul><li data-id="text" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Text"><i class="fa fa-font"></i></li><li data-id="image" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Image"><i class="fa fa-picture-o"></i></li><li data-id="gallery" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Gallery"><i class="fa fa-th-large"></i></li><li data-id="video" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Video"><i class="fa fa-youtube-play"></i></li><li data-id="file" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="File"><i class="fa fa-download"></i></li><li data-id="form" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Contact Form"><i class="fa fa-envelope-o"></i></li><li data-id="map" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Map"><i class="fa fa-map-o"></i></li><li data-id="share" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Share Buttons"><i class="fa fa-share-alt"></i></li><li data-id="spacer" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Spacer"><i class="fa fa-arrows-v"></i></li><li data-id="code" class="inlinecms-widget-element ui-draggable ui-draggable-handle" title="Code"><i class="fa fa-code"></i></li></ul>
				</div>
			</div>-->
			<div id="tab-pages" class="tab">
				<div class="buttons">
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>
				<div class="tab-content">
					<div class="dd">
			            <ol class="dd-list">
			            	@foreach(\App\Page::orderBy('title')->get() as $page)
			                    {!! renderPage($page) !!}
			                @endforeach
			            </ol>
			        </div> 
		        </div>
			</div>
			<div id="tab-menus" class="tab">
				<div class="buttons">
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>
				<div class="tab-content">
					<div class="dd nestable">
			            <ol class="dd-list">
			            	@foreach(\App\Menue::all()->toHierarchy() as $node)
			                    {!! renderNode($node) !!}
			                @endforeach
			            </ol>
			        </div>
		        </div>
			</div>
			<div id="tab-collections" class="tab">
				<div class="buttons">
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>
				<div class="tab-content">
					<div class="dd">
			             BLOG - Image slider
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
		</div><!-- tabs end -->
      </div>
      <!--<div id="save-buttons" class="modal-footer">
        <button id="savePage" type="button" class="btn btn-primary"><i class="fa fa-fw fa-check"></i>Save</button>
        <button type="button" class="btn btn-primary"><i class="fa fa-fw fa-sign-out"></i>Save &amp; Exit</button>
      </div>-->
      </div>
    </div>
  </div>
</div>

<div id="editor-loading"><i class="fa fa-spinner fa-pulse"></i></div>
	<script src="/js/app.js"></script>
	<script src='/js/jquery-ui.js'></script>
	<script src="/packages/nestable-fork/src/jquery.nestable.js"></script>
	<script src="/js/editor.js"></script>
</body>
</html>