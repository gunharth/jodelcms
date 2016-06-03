{!! Form::open([
            'route' => ['menue.store'],
            'id' => 'createMenu'
        ]) !!}
 
        <div class="form-group">
	    {!! Form::label('name','Menu name') !!}
	    {!! Form::text('name',null,['class' => 'form-control', 'placeholder' => 'menu name']) !!}
	    </div>
  {!! Form::close() !!}