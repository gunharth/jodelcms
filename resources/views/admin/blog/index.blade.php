<div class="tabs">
    
    <ul>
        <li><a href="#collection-tab1">Posts</a></li>
        <li><a href="#collection-tab2">Categories</a></li>
        <li><a href="#collection-tab3"><i class="fa fa-gear"></i></a></li>
    </ul>        
    
    <div id="collection-tab1">
        <div class="row">
        <div class="col-sm-4">
        <div class="buttons">
				<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
			</div>


			<ol class="dd-list" id="collectionItems">
		            	 @foreach($posts as $post)
		            	<li class="dd-item" data-collection="blog" data-id="{{ $post->id }}">
		            		<div class="dd-content" style="padding-left:5px; padding-right:5px;">
		            			<span class="dd-title" style="width: 120px">{{ $post->title }}</span>
		            			<div class="btn-group pull-right" role="group" aria-label="...">
		            				<button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser"><i class="fa fa-external-link" data-url="{{ $post->link }}"></i></button>
		            				<button type="button" class="btn btn-link btn-xs edit" data-toggle="tooltip" title="edit"><i class="fa fa-gear"></i></button>
		            				{{-- <button type="button" class="btn btn-link btn-xs duplicate" data-toggle="tooltip" title="duplicate"><i class="fa fa-copy"></i></button> --}}
		            				<button type="button" class="btn btn-link btn-xs delete" data-toggle="tooltip" title="delete"><i class="fa fa-fw fa-times"></i></button>
		            		</div>
		            		</div>
		            	</li>
		            	@endforeach
		            </ol>
					


	    </div>
		<div class="col-sm-8" id="collection-tab1-left"></div>
	    </div>

    </div>
    
    <div id="collection-tab2">
			Todo: Blog categories
        

    </div>

    <div id="collection-tab3">
			Todo: Blog settings (pagination, etc ....)
			{{ config('settings.post_paginate') }}

			{!! Form::open([
		        'method' => 'PATCH',
		        'url' => ['/'.config('app.locale').'/admin/settings'],
		        'id' => 'settings'
		    ]) !!}

     		<div class="form-group">
                {!! Form::label('post_paginate','Pagination') !!}
                {!! Form::text('post_paginate',config('settings.post_paginate'),['class' => 'form-control']) !!}
            </div>

    <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-dialog-buttonset"><button type="button" class="ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text">Save</span></button></div></div>

{!! Form::close() !!}
       

    </div>
    
</div>