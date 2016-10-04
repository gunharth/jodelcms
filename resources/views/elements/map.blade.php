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
		<div id="element_{{ $element->id }}_map" style="height: {{ $element->options->height }}px; width: {{ $element->options->width }};"></div>
	</div>
</div>

@if (Auth::check())
<script>    
options.element_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>
@endif

@if (! Auth::check())
@push('elementsScripts')
    <script>new google.maps.Marker({
    position: new google.maps.LatLng({{ $element->options->lat }}, {{ $element->options->lng }}),
    title: "aaa",
    map: new google.maps.Map(document.getElementById("element_{{ $element->id }}_map"), {
        center: new google.maps.LatLng({{ $element->options->lat }}, {{ $element->options->lng }}),
        zoom: {{ $element->options->zoom }}
    })
});</script>
@endpush

@endif