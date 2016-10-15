{!! Form::model([
        'method' => 'PATCH',
        'url' => ['/'.config('app.locale').'/admin/element/'.$id],
        'id' => 'updateElement'
    ]) !!}

    <input type="hidden" name='locale' value="{{ config('app.locale') }}">
	<div class="form-group">
	    {!! Form::label('size','Size') !!}
	    {!! Form::text('size',null,['class' => 'form-control', 'placeholder' => '20']) !!}
	</div>

{!! Form::close() !!}