{{-- {!! Form::model([
        //'method' => 'PATCH',
        //'url' => ['/'.config('app.locale').'/admin/element/'.$id],
        'class' => 'form-horizontal',
        'id' => 'updateElement'
    ]) !!} --}}
    <form method="POST" class="form-horizontal" action="#" accept-charset="UTF-8">


    <input type="hidden" name="locale" value="en">
	<div class="form-group">
	    <label for="width" class="col-sm-2">Width</label>
	    <div class="col-sm-10">
	    <input class="form-control" placeholder="100%" name="width" type="text" id="width">
	    </div>
	</div>
	<div class="form-group">
	    <label for="height" class="col-sm-2">Height</label>
	    <div class="col-sm-10">
	    <input class="form-control" placeholder="200" name="height" type="text" id="height">
	    </div>
	</div>
	<div class="form-group">
	    <label for="zoom" class="col-sm-2">Zoom</label>
	    <div class="col-sm-10">
	    <input class="form-control" placeholder="12" name="zoom" type="text" id="zoom">
	    </div>
	</div>
	<div class="row">
		<div class="col-sm-2"></div>
		<div class="col-sm-10">
	    <a href="#" class="find-coords">Find Address</a> <a href="#" class="current-location">Current Location</a><br>
	    </div>
	</div>
	<div class="form-group">
	    <label for="lat" class="col-sm-2">Latitude</label>
	    <div class="col-sm-10">
	    <input class="form-control" name="lat" type="text" id="lat">
	    </div>
	</div>
	<div class="form-group">
	    <label for="lng" class="col-sm-2">Longitude</label>
	    <div class="col-sm-10">
	    <input class="form-control" name="lng" type="text" id="lng">
	    </div>
	</div>
	<div class="form-group">
	    <label for="icon" class="col-sm-2">Icon URL</label>
	    <div class="col-sm-10">
	    <input class="form-control" placeholder="https://domain.com/icon.png" name="icon" type="text" id="icon">
	    </div>
	</div>
	<div class="row">
		<div class="col-sm-2"></div>
		<div class="col-sm-10">
	    <a href="https://snazzymaps.com" target="_blank">https://snazzymaps.com</a><br>
	    </div>
	</div>
	<div class="form-group">
	    <label for="styles" class="col-sm-2">Styles</label>
	    <div class="col-sm-10">
	    <textarea class="form-control" rows="3" placeholder="[]" name="styles" cols="50" id="styles"></textarea>
	    </div>
	</div>
	<div class="form-group">
	    <label for="title" class="col-sm-2">Marker</label>
	    <div class="col-sm-10">
	    <input class="form-control" name="title" type="text" id="title">
	    </div>
	</div>

</form>