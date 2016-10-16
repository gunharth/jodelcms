<div class="jodelcms-element dummy" id="dummy_{{ $element->id }}" data-type="{{ $element->type }}">
	<div class="jodelcms-content" id="dummy_{{ $element->id }}_content" data-field="{{ $element->id }}">
	
		{!! Form::open([
        'class' => 'form-horizontal',
        'id' => 'form_dummy_'.$element->id
    ]) !!}

		@foreach($element->options->fields as $field)
    		<div class="form-group">
	            <label for="{{ $field->title}}" class="col-sm-2 control-label">{{ $field->title}} @if($field->isMandatory) * @endif</label>
	            <div class="col-sm-10">
	            @if($field->type == 'textarea')
	            	<textarea class="form-control" placeholder="{{ $field->title}}" name="field[{{ $loop->index }}]" id="{{ $field->title}}" @if($field->isMandatory) required="required" @endif></textarea>
	            @endif
	            @if($field->type == 'text')
	            	<input class="form-control" placeholder="{{ $field->title}}" name="field[{{ $loop->index }}]" type="{{ $field->type}}" id="{{ $field->title}}" @if($field->isMandatory) required="required" @endif>
	            @endif
	            @if($field->type == 'email')
	            	<input class="form-control" placeholder="{{ $field->title}}" name="field[{{ $loop->index }}]" type="{{ $field->type}}" id="{{ $field->title}}" @if($field->isMandatory) required="required" @endif>
	            @endif
	            	
	            </div>
            </div>
		@endforeach

			<div class="form-group">
	            <label for="" class="col-sm-2 control-label"></label>
	            <div class="col-sm-10">
	            	<input type="submit" name="submit" value="{{ $element->options->submit }}">
	            </div>
            </div>

		</form>
	</div>
</div>
<script>    
options.dummy_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>