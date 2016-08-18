<div class="tabs">
    
        <ul>
            <li><a href="#tab-page-basic">Basic</a></li>
            <li><a href="#tab-page-seo">Details</a></li>
            <li><a href="#tab-page-adv">Advanced</a></li>
        </ul>        
        
        <div id="tab-page-basic">
            
            <div class="form-group">
    	    {!! Form::label('title','Post Title (internal)') !!}
    	    {!! Form::text('title',null,['class' => 'form-control', 'placeholder' => 'Post Title']) !!}
    	    </div>
            <div class="form-group">
            {!! Form::label('slug','Slug') !!}
            {!! Form::text('slug',null,['class' => 'form-control', 'placeholder' => 'Slug']) !!}
            </div>
            <div class="form-group">
            {!! Form::label('published_at','Publish On') !!}
            {!! Form::date('published_at',$published_at,['class' => 'form-control']) !!}
            </div>
	
        </div>
        
        <div id="tab-page-seo">

            <div class="form-group">
                {!! Form::label('meta_title','Meta Title') !!}
                {!! Form::text('meta_title',null,['class' => 'form-control', 'placeholder' => 'Post Title']) !!}
            </div>

            <div class="form-group">
                {!! Form::label('meta_description','Meta Description') !!}
                {!! Form::textarea('meta_description',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'Post Description']) !!}
            </div>

            <div class="form-group">
                {!! Form::label('meta_keywords','Meta Keywords (deprecated)') !!}
                {!! Form::textarea('meta_keywords',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'Post Keywords']) !!}
            </div>

        </div>

        <div id="tab-page-adv">

            <div class="form-group">
                {!! Form::label('head_code','Additional head content') !!}
                {!! Form::textarea('head_code',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'open graph data, etc.']) !!}
            </div>

           <div class="form-group">
                {!! Form::label('body_start_code','Code right after the body tag') !!}
                {!! Form::textarea('body_start_code',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'google anylytics code, etc.']) !!}
            </div>
            
            <div class="form-group">
                {!! Form::label('body_end_code','Code before the end body tag') !!}
                {!! Form::textarea('body_end_code',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'optional javascripts, etc.']) !!}
            </div>

        </div>

        <div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-dialog-buttonset"><button type="button" class="submit ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text">Save</span></button></div></div>
        
    </div>