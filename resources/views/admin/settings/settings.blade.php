{!! Form::open([
	        'method' => 'PATCH',
	        'url' => ['/'.config('app.locale').'/admin/settings'],
	        'id' => 'settings'
	    ]) !!}

	    <div class="form-group"> 
            {!! Form::label('googlemap_api','Google Maps API Key') !!}
            {!! Form::text('googlemap_api',config('settings.googlemap_api'),['class' => 'form-control']) !!}
        </div>

		<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"><div class="ui-dialog-buttonset"><button type="button" class="submit ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only" role="button"><span class="ui-button-text">Save</span></button></div></div>

		{!! Form::close() !!}