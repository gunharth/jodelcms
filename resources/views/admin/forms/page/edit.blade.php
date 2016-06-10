{!! Form::model($page,[
        'method' => 'PATCH',
        'route' => ['page.update', $page->slug],
        'id' => 'updatePage'
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
	
        </div>
        
        <div id="tab-page-seo">
            <fieldset>
                
                <div class="field">
                    {!! Form::label('meta_description','Page Description') !!}
                    {!! Form::textarea('meta_description',null,['class' => 'form-control', 'placeholder' => 'Page Description']) !!}
                </div>

                <div class="field">
                    {!! Form::label('meta_keywords','Page Keywords') !!}
                    {!! Form::text('meta_keywords',null,['class' => 'form-control', 'placeholder' => 'Page Keywords']) !!}
                </div>
                
            </fieldset>
        </div>
        
    </div>
  {!! Form::close() !!}