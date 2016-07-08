<div class="tabs">
    
        <ul>
            <li><a href="#tab-collection-tab1">Posts</a></li>
            <li><a href="#tab-collection-tab2">Categories</a></li>
            <li><a href="#tab-collection-tab3"><i class="fa fa-gear"></i></a></li>
        </ul>        
        
        <div id="tab-collection-tab1">
            <div class="row">
            <div class="col-sm-4">
            <div class="buttons">
					<button class="btn btn-sm btn-create" title="Create"><i class="fa fa-plus"></i></button>
				</div>


				<ol class="dd-list">
			            	 @foreach($posts as $post)
			            	<li class="dd-item" data-collection="blog">
			            		<div class="dd-content" style="padding-left:5px; padding-right:5px;"><span class="dd-title" style="width: 120px">{{ $post->title }}</span><div class="btn-group pull-right" role="group" aria-label="..."><button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser"><i class="fa fa-external-link" data-url="{{ $post->link }}"></i></button><button type="button" class="btn btn-link btn-xs openCollection" data-toggle="tooltip" title="edit"><i class="fa fa-gear"></i></button><button type="button" class="btn btn-link btn-xs duplicate" data-toggle="tooltip" title="duplicate"><i class="fa fa-copy"></i></button><button type="button" class="btn btn-link btn-xs delete" data-toggle="tooltip" title="delete"><i class="fa fa-fw fa-times"></i></button>
			            		</div>
			            		</div>
			            	</li>
			            	@endforeach
			            </ol>


    	    </div>
			<div class="col-sm-6"></div>
    	    </div>
	
        </div>
        
        <div id="tab-collection-tab2">
				Todo: Blog categories
            

        </div>

        <div id="tab-collection-tab3">
				Todo: Blog settings (pagination, etc ....)
           

        </div>
        
    </div>