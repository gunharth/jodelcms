<form class="form-horizontal">

	@foreach($options->fields as $field)
		<div class="form-group">
            <label for="{{ $field->title}}" class="col-sm-2 control-label">{{ $field->title}} @if($field->isMandatory) * @endif</label>
            <div class="col-sm-10">
            	<input class="form-control" placeholder="{{ $field->title}}" name="{{ $field->title}}" type="{{ $field->type}}" id="{{ $field->title }}">
            </div>
        </div>
	@endforeach

	<div class="form-group">
        <label for="" class="col-sm-2 control-label"></label>
        <div class="col-sm-10">
        	<input type="submit" name="submit" value="{{ $options->submit }}">
        </div>
    </div>

</form>