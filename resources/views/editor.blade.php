<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<link rel="stylesheet" href="/css/app.css">
</head>
<body>
	<iframe id="editorIFrame" src="/text/{{ $text->id}}/edit" frameborder="0" style="position: absolute; margin: 0; padding:0; width: 100%; height: 100%"></iframe>
	<div id="cms-panel" style="position: fixed; z-index: 1000; width: 200px; height: 200px; top: 300px; left: 50px; display: block; background: #f4f4f4">
	<button id="savePage">Save</button>
	</div>
	<script src="/js/app.js"></script>
	<script>
		$(document).ready(function() {

      $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
});
      $('#savePage').on('click', function(e) {
      	e.preventDefault();
        $('#editorIFrame').get(0).contentWindow.savePage();
          
    });
      });
	</script>
</body>
</html>