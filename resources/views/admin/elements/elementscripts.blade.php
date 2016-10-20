@push('elementsStyles')
<link type="text/css" rel="stylesheet" href="//cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials.css" />
<link type="text/css" rel="stylesheet" href="//cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials-theme-flat.css" />
@endpush

@push('elementsScripts')
<script type="text/javascript" src="//cdn.jsdelivr.net/jquery.jssocials/1.4.0/jssocials.min.js"></script>
<script type="text/javascript" src="//maps.googleapis.com/maps/api/js?language={{ App::getLocale() }}&key={{ config('settings.googlemap_api') }}"></script>
@endpush