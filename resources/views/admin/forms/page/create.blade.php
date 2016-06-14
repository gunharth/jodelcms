{!! Form::open([
            'route' => ['page.store'],
            'id' => 'createPage'
        ]) !!}
	
    <div class="tabs">
    
        <ul>
            <li><a href="#tab-page-basic">Basic</a></li>
            <li><a href="#tab-page-seo">Details</a></li>
        </ul>        
        
        <div id="tab-page-basic">
            
        <div class="form-group">
	    {!! Form::label('title','Page Title') !!}
	    {!! Form::text('title',null,['class' => 'form-control', 'placeholder' => 'Page Title']) !!}
	    </div>
        <div class="form-group">
        {!! Form::label('template_id','Template') !!}
        {!! Form::select(
                'template_id',
                $templates,
                0,
                ['class' => 'form-control']
                ) !!}
        </div>
	
        </div>
        
        <div id="tab-page-seo">
            <fieldset>
                
                <div class="field">
                    <label for="description">Page Description:</label>
                    <textarea name="description"></textarea>
                </div>

                <div class="field">
                    <label for="keywords">Page Keywords:</label>
                    <input type="text" name="keywords">
                </div>
                
            </fieldset>
        </div>
        
    </div>
  {!! Form::close() !!}