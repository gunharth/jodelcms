<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>jodelCMS</title>
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<link rel="stylesheet" href="/css/jquery-ui.css">
	<link rel="stylesheet" href="/css/superhero.css">
	<link rel="stylesheet" href="/css/editor.css">
	<link rel="stylesheet" href="/font-awesome/css/font-awesome.css">
</head>
<body>
	<iframe id="editorIFrame" name="editorIFrame" src="{{ $src }}?menu={{ Request::path() }}" frameborder="0" style="position: absolute; margin: 0; padding:0; width: 100%; height: 100%;"></iframe>

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
			<a class="tb-refresh" href="#" title="Refresh"><i class="fa fa-fw fa-lg fa-refresh"></i></a>
			<a class="tb-collapse" href="#" title="Toggle"><i class="fa fa-fw fa-lg fa-caret-up"></i></a>
			<a href="/logout" title="Sign out"><i class="fa fa-lg fa-sign-out"></i></a>
		</div>
        
      </div>
      <div id="modal-toggle">
      <div class="modal-body">
        <div id="tabs">
			<ul class="list-inline">
				<li><a href="#tab-pages">Pages</a></li>
				<li><a href="#tab-menus">Menus</a></li>
				<li><a href="#tab-collections">Collections</a></li>
				<li><a href="#tab-elements">Elements</a></li>
				<li><a href="#tab-settings"><i class="fa fa-gear"></i></a></li>
			</ul>
			<div id="tab-pages" class="tab">
				<div class="buttons">
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>
				<div class="tab-content">
					<div class="dd">
			            <ol class="dd-list" id="pageItems">
			            	@foreach(\App\Page::orderBy('title')->get() as $page)
			                    {!! renderEditorPages($page) !!}
			                @endforeach
			            </ol>
			        </div> 
		        </div>
			</div>
			<div id="tab-menus" class="tab">
				<div class="buttons">
					<select name="menuSelector" id="menuSelector" class="form-control">
						@foreach (Config::get('jodel.menus') as $name => $id)
						     <option value="{{ $id }}">{{ $name }} </option>
						@endforeach
					</select>
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>
				<div class="tab-content">
					<div class="dd nestable">
			            <ol class="dd-list" id="menuItems">

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
			<div id="tab-elements" class="tab">
				<div class="buttons">
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>
				<div class="tab-content">
					<div class="dd">
			             Element
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