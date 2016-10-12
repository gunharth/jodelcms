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
	
		{{-- <form class="form-horizontal"> --}}
		{!! Form::open([
        'url' => '/elements/submitForm',
        'class' => 'form-horizontal'
    ]) !!}
		{{ csrf_field() }}

		@foreach($element->options->fields as $field)
    		<div class="form-group">
	            <label for="{{ $field->title}}" class="col-sm-2 control-label">{{ $field->title}}</label>
	            <div class="col-sm-10">
	            @if($field->type == 'textarea')
	            	<textarea class="form-control" placeholder="{{ $field->title}}" name="{{ $field->title}}" id="{{ $field->title}}"></textarea>
	            @endif
	            @if($field->type == 'text')
	            	<input class="form-control" placeholder="{{ $field->title}}" name="{{ $field->title}}" type="{{ $field->type}}" id="{{ $field->title}}">
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