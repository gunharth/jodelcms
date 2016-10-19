<div class="jodelcms-element dummy" id="dummy_{{ $element->id }}" data-type="{{ $element->type }}">
	<div class="jodelcms-content" id="dummy_{{ $element->id }}_content" data-field="{{ $element->id }}">
	<div id="dummy_{{ $element->id }}_social"></div>
	</div>
</div>
<script>    
options.dummy_{{ $element->id }} = {!! json_encode($element->options) !!};
	$('#dummy_{{ $element->id }}_social').jsSocials({
		showLabel: false,
    	showCount: false,
    	shareIn: "popup",
	    shares: ["twitter", "facebook", "googleplus", "linkedin", "pinterest", "stumbleupon", "whatsapp"]
	});
</script>