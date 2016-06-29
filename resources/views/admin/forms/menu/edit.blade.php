{!! Form::model($menu,[
        'method' => 'PATCH',
        'route' => ['menu.update', $menu->id],
        'id' => 'updateMenu'
    ]) !!}

            
        <div class="form-group">
	    {!! Form::label('name','Menu Title') !!}
	    {!! Form::text('name',null,['class' => 'form-control', 'placeholder' => 'Menu Title']) !!}
	    </div>
	    <div class="form-group">
	    {!! Form::label('slug','Slug') !!}
	    {!! Form::text('slug',null,['class' => 'form-control', 'placeholder' => 'slug']) !!}
	    </div>
	    <div class="form-group">
	    {!! Form::label('morpher_id','Morpher ID') !!}
	    {!! Form::text('morpher_id',4,['class' => 'form-control']) !!}
	    </div>
	    <div class="form-group">
	    {!! Form::label('morpher_type','Morpher Type') !!}
	    {!! Form::text('morpher_type','App\Page',['class' => 'form-control']) !!}
	    </div>

  {!! Form::close() !!}