<html>
<head></head>
<body style="background: black; color: white">
@foreach($fields as $field)	
	<p>{{ $field['name'] }}: {!! nl2br(e($field['value'])) !!}</p>
@endforeach
</body>
</html>