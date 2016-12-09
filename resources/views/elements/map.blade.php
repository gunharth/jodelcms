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
@pushonce('elementsScripts:googlemaps')
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?language={{ App::getLocale() }}&key={{ config('settings.googlemap_api') }}"></script>
@endpushonce

@push('elementsScripts')
<script>
//console.log(!('ontouchstart' in document.documentElement))
var isNotTouch = !('ontouchstart' in document.documentElement);
new google.maps.Marker({
position: new google.maps.LatLng({{ $element->options->lat }}, {{ $element->options->lng }}),
title: "",
icon: '{{ $element->options->icon }}',
map: new google.maps.Map(document.getElementById("element_{{ $element->id }}_map"), {
    center: new google.maps.LatLng({{ $element->options->lat }}, {{ $element->options->lng }}),
    zoom: {{ $element->options->zoom }},
    styles: {!! $element->options->styles !!},
    draggable: isNotTouch,
  	scrollwheel: isNotTouch
})
});</script>
@endpush
@endif