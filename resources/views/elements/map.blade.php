<div class="jodelcms-element" id="element_{{ $element->id }}" data-type="{{ $element->type }}">
	<div class="jodelcms-content" id="element_{{ $element->id }}_content" data-field="{{ $element->id }}">
		<div id="element_{{ $element->id }}_map" style="height: 400px; width: 100%;"></div>
	</div>
</div>

@if (Auth::check())
<script>    
options.element_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>
@endif

<script type="text/javascript" src="http://maps.googleapis.com/maps/api/js?language=en&key=AIzaSyCRqfUKokTWoFg77sAhHOBew_NLgepcTOM"></script>
<script>new google.maps.Marker({
    position: new google.maps.LatLng(48.856614, 2.3522219),
    title: "Paris",
    map: new google.maps.Map(document.getElementById("element_{{ $element->id }}_map"), {
        center: new google.maps.LatLng(48.856614, 2.3522219),
        zoom: 12
    })
});</script>