{!! Form::model($menu,[
        'method' => 'PATCH',
        'route' => ['menu.update', $menu->slug],
        'id' => 'updateMenu'
    ]) !!}

            
        <div class="form-group">
	    {!! Form::label('name','Menu Title') !!}
	    {!! Form::text('name',null,['class' => 'form-control', 'placeholder' => 'Menu Title']) !!}
	    </div>

  {!! Form::close() !!}