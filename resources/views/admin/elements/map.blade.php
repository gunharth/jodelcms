{!! Form::model($element->options,[
        'method' => 'PATCH',
        'url' => ['/'.config('app.locale').'/admin/element/'.$element->id],
        'id' => 'updateElement'
    ]) !!}

    <input type="hidden" name='locale' value="{{ config('app.locale') }}">
	<div class="form-group">
	    {!! Form::label('width','Width') !!}
	    {!! Form::text('width',null,['class' => 'form-control', 'placeholder' => '100%']) !!}
	</div>
	<div class="form-group">
	    {!! Form::label('height','Height') !!}
	    {!! Form::text('height',null,['class' => 'form-control', 'placeholder' => '200']) !!}
	</div>
	<div class="form-group">
	    {!! Form::label('zoom','Zoom') !!}
	    {!! Form::text('zoom',null,['class' => 'form-control', 'placeholder' => '12']) !!}
	</div>
	<div class="form-group">
	    {!! Form::label('lat','Latitude') !!}
	    {!! Form::text('lat',null,['class' => 'form-control']) !!}
	</div>
	<div class="form-group">
	    {!! Form::label('lng','Longitude') !!}
	    {!! Form::text('lng',null,['class' => 'form-control']) !!}
	</div>
	<div class="form-group">
	    {!! Form::label('title','Marker') !!}
	    {!! Form::text('title',null,['class' => 'form-control']) !!}
	</div>

	<div class="form-group">
	    <a href="#" class="find-coords">Find Adress</a> <br>
	    <label>Lat: <input type="text" name="lat" class="m-lat"></label>
                <label>Lng: <input type="text" name="lng" class="m-lng"></label>
	</div>

{!! Form::close() !!}