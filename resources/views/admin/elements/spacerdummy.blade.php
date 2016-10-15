<div class="jodelcms-element dummy" id="dummy_{{ $element->id }}" data-type="{{ $element->type }}">
	<div class="jodelcms-content" id="dummy_{{ $element->id }}_content" data-field="{{ $element->id }}">
		<div style="height: {{ $element->options->size }}px; width: 100%;"></div>
	</div>
</div>

<script>    
options.dummy_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>