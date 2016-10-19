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

@if (Auth::check())
<script>    
options.element_{{ $element->id }} = {!! json_encode($element->options) !!};
</script>
@endif

@if (! Auth::check())
@pushonce('elementsStyles:jssocial')
<link type="text/css" rel="stylesheet" href="//cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials.css" />
<link type="text/css" rel="stylesheet" href="//cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials-theme-flat.css" />
@endpushonce

@pushonce('elementsScripts:jssocial')
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials.min.js"></script>
@endpushonce
@endif

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