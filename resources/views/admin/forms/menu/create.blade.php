{!! Form::open([
            'route' => ['menu.store'],
            'id' => 'createMenu'
        ]) !!}
 		{!! Form::hidden('menu_id',$id) !!}
        <div class="form-group">
	    {!! Form::label('name','Menu name') !!}
	    {!! Form::text('name',null,['class' => 'form-control', 'placeholder' => 'menu name']) !!}
	    </div>
	    <div class="form-group">
	    {!! Form::label('slug','Slug') !!}
	    {!! Form::text('slug',null,['class' => 'form-control', 'placeholder' => 'slug']) !!}
	    </div>
	    <div class="form-group">
	    {!! Form::label('morpher_type','Link') !!}
	     {!! Form::select(
                'morpher_type',
                Config::get('jodel.contentTypes'),
                0,
                ['class' => 'form-control', 'id' => 'menuTypeSelector']
                ) !!}
	    </div>
	    <div class="form-group">
            {!! Form::select(
                'morpher_id',
                [],
                '',
                ['class' => 'form-control', 'id' => 'menuTypeItemSelector']
                ) !!}
        </div>
  {!! Form::close() !!}