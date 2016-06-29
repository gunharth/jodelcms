{!! Form::open([
            'route' => ['menu.store'],
            'id' => 'createMenu'
        ]) !!}
 		{!! Form::hidden('menu_id',$id) !!}
        <div class="form-group">
	    {!! Form::label('name','Menu name') !!}
	    {!! Form::text('name',null,['class' => 'form-control', 'placeholder' => 'menu name']) !!}
	    </div>
  {!! Form::close() !!}