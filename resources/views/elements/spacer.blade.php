
<div class="jodelcms-element" id="element_{{ $element->id }}" data-type="{{ $element->type }}">
	<div class="jodelcms-content" id="element_{{ $element->id }}_content" data-field="{{ $element->id }}">
		<div style="height: {{ $element->options->size }}px; width: 100%;"></div>
	</div>
</div>

@if (Auth::check())
<script>    
options.element_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>
@endif