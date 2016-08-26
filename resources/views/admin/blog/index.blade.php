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
				<div id="collectionItemsOuter">
					
				</div>
		  	</div>
			<div class="col-sm-8" id="collection-tab1-left"></div>
	 	</div>
    </div>
    
    <div id="collection-tab2">
			Todo: Blog categories
    </div>

    <div id="collection-tab3">

		{!! Form::open([
	        'method' => 'PATCH',
	        'url' => ['/'.config('app.locale').'/admin/settings'],
	        'id' => 'settings'
	    ]) !!}

	    <div class="form-group"> 
            {!! Form::label('blog_title','Blog Title') !!}
            {!! Form::text('blog_title',config('settings.blog_title'),['class' => 'form-control']) !!}
        </div>

 		<div class="form-group">
            {!! Form::label('blog_paginate','Pagination') !!}
            {!! Form::text('blog_paginate',config('settings.blog_paginate'),['class' => 'form-control']) !!}
        </div>

		<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-dialog-buttonset"><button type="button" class="submit ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text">Save</span></button></div></div>

		{!! Form::close() !!}
    </div>
    
</div>