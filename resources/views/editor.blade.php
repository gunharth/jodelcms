<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>jodelCMS</title>
	<meta name="csrf-token" content="{{ csrf_token() }}">
	<link rel="stylesheet" href="/css/jquery-ui.css">
	<link rel="stylesheet" href="/css/paper.css">
	<link rel="stylesheet" href="/css/editor.css">
	<link rel="stylesheet" href="/font-awesome/css/font-awesome.css">
</head>
<body>
	<iframe id="editorIFrame" name="editorIFrame" src="{{ $src }}?menu={{ $menu }}" frameborder="0"></iframe>
	
	<div id="editor-panel-left" style="display: none; position: absolute; right: -53px; z-index: 99999; width: 50px, height: 50px; background: #999">
		<div class="modal-content">
			<div class="modal-header">
				<a class="tb-collapse-left" href="#" title="Toggle"><i class="fa fa-fw fa-lg fa-caret-left"></i></a>
			</div>
		</div>
	</div>
	<div id="editor-panel" class="modal">
	  <div class="modal-dialog">
	    <div class="modal-content">
	      <div class="modal-header">
	        <!--<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>-->
	        <div class="col-sm-2">
	        	<h4 class="modal-title">J</h4>
	        </div>
	        <div class="col-sm-10 text-right">
				<select id="editorLocales" class="editor-langs form-control" style="width: 30%; float: left;">
				    @foreach(LaravelLocalization::getSupportedLocales() as $localeCode => $properties)
				    <option value="{{$localeCode}}">{{ strtoupper($localeCode) }}</option>
				    @endforeach
	            </select> 
				<a class="tb-refresh" href="#" title="Refresh"><i class="fa fa-fw fa-lg fa-refresh"></i></a>
				<a class="tb-collapse" href="#" title="Toggle"><i class="fa fa-fw fa-lg fa-caret-up"></i></a>
				<a class="tb-collapse-right" href="#" title="Toggle"><i class="fa fa-fw fa-lg fa-caret-right"></i></a>
				<a class="tb-toggle" href="#" title="Pin"><i class="fa fa-fw fa-lg fa-lock"></i></a>
				<!-- <a href="/logout" title="Sign out"><i class="fa fa-lg fa-sign-out"></i></a> -->
				 
			</div>
	        
	      </div>
	      <div id="modal-toggle">
	      <div class="modal-body">
	        <div id="tabs">
				<ul class="list-inline">
					<li><a href="#tab-elements"><i class="fa fa-fw fa-lg fa-font"></i>Elements</a></li>
					<li><a href="#tab-pages"><i class="fa fa-fw fa-lg fa-file-text-o"></i>Pages</a></li>
					<li><a href="#tab-menus"><i class="fa fa-fw fa-lg fa-bars"></i>Menus</a></li>
					<li><a href="#tab-collections"><i class="fa fa-fw fa-lg fa-th-list"></i>Collections</a></li>
					<li><a href="#tab-settings"><i class="fa fa-gear"></i></a></li>
				</ul>
				<div id="tab-elements" class="tab">
					<!-- <div class="buttons">
						<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
					</div> -->
					<div class="tab-content">
						<div class="dd">
				             <div class="list">
								<ul style="padding:0"></ul>
							</div>
				        </div> 
			        </div>
				</div>
				<div id="tab-pages" class="tab">
					<div class="buttons">
						<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
					</div>
					<div class="tab-content">
						<div class="dd">
				            <ol class="dd-list" id="pageItems">
				            	
				            </ol>
				        </div> 
			        </div>
				</div>
				<div id="tab-menus" class="tab">
					<div class="buttons">
						<select name="menuSelector" id="menuSelector" class="form-control" style="margin-bottom: 5px">
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
				             <ol class="dd-list">
				            	<li class="dd-item" data-collection="blog">
				            		<div class="dd-content"><span class="dd-title">Blog</span><div class="btn-group pull-right" role="group" aria-label="...">
				            			<!-- <button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser"><i class="fa fa-external-link" data-url="/page/home"></i></button> -->
				            			<button type="button" class="btn btn-link btn-xs openCollection" data-toggle="tooltip" title="edit"><i class="fa fa-gear"></i></button>
				            			<!-- <button type="button" class="btn btn-link btn-xs duplicate" data-toggle="tooltip" title="duplicate"><i class="fa fa-copy"></i></button><button type="button" class="btn btn-link btn-xs"><i class="fa fa-fw"></i></button> -->
				            		</div>
				            		</div>
				            	</li>
				            </ol>
				             Image Slider <br>
				             Directors <br>
				             Spots <br>
				        </div> 
			        </div>
				</div>
	            <div id="tab-settings" class="tab">
	                <div class="buttons">
						<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
					</div>
					<div class="tab-content">
						<div class="dd">
				             <ol class="dd-list">
				            	<li class="dd-item" data-setting="settings">
				            		<div class="dd-content"><span class="dd-title">Global Settings</span><div class="btn-group pull-right" role="group" aria-label="...">
				            			<button type="button" class="btn btn-link btn-xs openSettings" data-toggle="tooltip" title="view"><i class="fa fa-gear"></i></button>
				            		</div>
				            		</div>
				            	</li>
				            	<li class="dd-item" data-setting="activity">
				            		<div class="dd-content"><span class="dd-title">Activity Log</span><div class="btn-group pull-right" role="group" aria-label="...">
				            			<button type="button" class="btn btn-link btn-xs openLogs" data-toggle="tooltip" title="view"><i class="fa fa-eye"></i></button>
				            		</div>
				            		</div>
				            	</li>

				            </ol>
				             <b>DEV ONLY:</b> <br>
				             <a href="/admin/resetdb">Reset Database</a> <br>
				             <a href="/admin/clearcache">Clear Cache</a> <br><br>
				             <b><a href="/admin/sitemap">Generate Sitemap</a> </b><br>
				             spatie google analytics ! <br>
				             spatie cookie plugin or https://silktide.com/tools/cookie-consent/ <br>
				             spatie backup! <br>
				             realfavicongenerator package <br>
				             Settings (Global Title, etc ... Mail Preferences) <br>
				             Users / Access <br>
				             Global Code (GA, Google webmaster tools, Bing webmaster tools, keep open to enter scripts like page specific codes) <br>
				             Need for Recycle bin ? <br>
				             offer external seo tools <br>
				        </div> 
			        </div>
	            </div>
			</div><!-- tabs end -->
			<div class="modal-footer">
				<div id="save-outer" class="col-sm-10">
					<button class="btn btn-success">
						<i class="fa fa-fw fa-exclamation-circle"></i> Save
					</button> 
					or hit CMD/CTRL S to save!
				</div>
				<div class="col-sm-2 pull-right text-right">
					<a href="{{ url('/logout') }}"
	                    onclick="event.preventDefault();
	                    document.getElementById('logout-form').submit();" 
	                    data-toggle="tooltip" 
	                    title="Logout">
	                    <i class="fa fa-lg fa-sign-out text-warning"></i>
	                </a>
	                <form id="logout-form" action="{{ url('/logout') }}" method="POST" style="display: none;">
	                    {{ csrf_field() }}
	                </form>
	            </div>
			</div>
	      </div>
	      </div>
	    </div>
	  </div>
	</div>
	<div id="editor-loading"><i class="fa fa-spinner fa-pulse"></i></div>
	<script src="/js/editor/editor.js"></script>
	<script src='/js/jquery-ui.js'></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>
	<script src="/packages/nestable-fork/src/jquery.nestable.js"></script>
	<script src="/js/editor.js"></script>
	<script src="/js/elements.js"></script>
	<script src="/js/elements/text.js"></script>
	<script src="/js/elements/spacer.js"></script>
	<script src="/js/elements/form.js"></script>
	<script src="/js/elements/map.js"></script>
	<script src="/js/elements/social.js"></script>
</body>
</html>