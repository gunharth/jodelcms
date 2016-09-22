<div class="jodelcms-element" id="element_{{ $element->id }}" data-type="{{ $element->type }}">
	<div class="jodelcms-content" id="element_{{ $element->id }}_content" data-field="{{ $element->id }}">
		<form class="form-horizontal">

		@foreach($element->options->fields as $field)
    		<div class="form-group">
	            <label for="{{ $field->title}}" class="col-sm-2 control-label">{{ $field->title}}</label>
	            <div class="col-sm-10">
	            	<input class="form-control" placeholder="{{ $field->title}}" name="{{ $field->title}}" type="{{ $field->type}}" id="{{ $field->title}}">
	            </div>
            </div>
		@endforeach

		</form>
	</div>
</div>