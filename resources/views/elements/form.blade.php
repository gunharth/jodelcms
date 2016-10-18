<div 
	@if ($editable) 
		class="jodelcms-element" id="element_{{ $element->id }}" data-type="{{ $element->type }}"
	@endif
>
	<div 
		@if ($editable) 
			class="jodelcms-content" id="element_{{ $element->id }}_content" data-field="{{ $element->id }}"
		@endif
	>
	
		{!! Form::open([
        //'route' => ['direct.elements.send',$element->id],
        'class' => 'form-horizontal',
        'id' => 'form_element_'.$element->id
    ]) !!}
		@if (!Auth::check())
		<input type="hidden" name="id" value="{{ $element->id }}">
		@endif

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

@if (Auth::check())
<script>    
options.element_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>
@endif

@if (! Auth::check())
@push('elementsScripts')
<script>
$(function() {
    $('#form_element_{{ $element->id }}').submit(function(e) {
    	e.preventDefault();
    	var form = $(this);

        let formData = form.serialize();

        $.ajax({
            type        : 'POST',
            url         : '/{{ App::getLocale() }}/elements/submitForm',
            data        : formData,
            encode          : true,
            error: (data) => {
                var error = $('<p class="text-danger">Please fill in all required fields</p>')
                form.prepend(error);
                error.delay(2000).slideUp();
            }
        })
        .done(function(response) {
            form.parent().html('<p>' + response + '</p>'); 
        });
    });
});
</script>
@endpush
@endif