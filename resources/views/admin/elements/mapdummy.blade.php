<div class="jodelcms-element dummy" id="dummy_{{ $element->id }}" data-type="{{ $element->type }}">
	<div class="jodelcms-content" id="dummy_{{ $element->id }}_content" data-field="{{ $element->id }}">
		<div id="dummy_{{ $element->id }}_map" style="height: {{ $element->options->height }}px; width: {{ $element->options->width }};"></div>
	</div>
</div>
<script>    
options.dummy_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>