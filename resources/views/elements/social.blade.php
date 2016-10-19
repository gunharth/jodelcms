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
		<div id="element_{{ $element->id }}_social"></div>
	</div>
</div>
<script>    
options.element_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>
@push('elementsScripts')
    <script>
    $('#element_{{ $element->id }}_social').jsSocials({
    	showLabel: {{ ($element->options->showLabel) ? 'true' : 'false' }},
    	showCount: {{ ($element->options->showCount) ? 'true' : 'false' }},
    	shareIn: "popup",
	    shares: ["{!! implode('","', $element->options->shares) !!}"]
	});
    </script>
@endpush