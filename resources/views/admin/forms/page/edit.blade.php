{!! Form::model($page,[
        'method' => 'PATCH',
        'route' => ['admin.page.update', $page->slug],
        'id' => 'updatePage'
    ]) !!}
	
    <div class="tabs">
    
        <ul>
            <li><a href="#tab-page-basic">Basic</a></li>
            <li><a href="#tab-page-seo">Details</a></li>
            <li><a href="#tab-page-adv">Advanced</a></li>
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
                    $page->template->id,
                    ['class' => 'form-control']
                    ) !!}
            </div>
	
        </div>
        
        <div id="tab-page-seo">

            <div class="form-group">
                {!! Form::label('meta_title','Meta Title') !!}
                {!! Form::text('meta_title',null,['class' => 'form-control', 'placeholder' => 'Page Title']) !!}
            </div>

            <div class="form-group">
                {!! Form::label('meta_description','Meta Description') !!}
                {!! Form::textarea('meta_description',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'Page Description']) !!}
            </div>

            <div class="form-group">
                {!! Form::label('meta_keywords','Meta Keywords') !!}
                {!! Form::textarea('meta_keywords',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'Page Keywords']) !!}
            </div>

        </div>

        <div id="tab-page-adv">

            <div class="form-group">
                {!! Form::label('head_code','Additional head content') !!}
                {!! Form::textarea('head_code',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'head content']) !!}
            </div>

           <div class="form-group">
                {!! Form::label('body_start_code','Code right after the body tag') !!}
                {!! Form::textarea('body_start_code',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'head content']) !!}
            </div>
            
            <div class="form-group">
                {!! Form::label('body_end_code','Code before the end body tag') !!}
                {!! Form::textarea('body_end_code',null,['class' => 'form-control', 'size' => '30x3', 'placeholder' => 'head content']) !!}
            </div>

        </div>
        
    </div>
  {!! Form::close() !!}