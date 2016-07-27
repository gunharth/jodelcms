<div class="tabs">
    
    <ul>
        <li><a href="#tab-collection-tab1">Activity Log</a></li>
    </ul>        
    
    <div id="tab-collection-tab1">
        <div class="row">
        <div class="col-sm-12">

			<ol class="dd-list">
		            	 @foreach($logs as $log)
		            	<li class="dd-item">
		            		<div class="dd-content">
		            			<span>
		            				{{ $log->description }}
		            				{{ $log->subject_type }} {{ $log->subject_id }} 
		            			</span>
		            		</div>
		            	</li>
		            	@endforeach
		            </ol>


	    </div>

    </div>

</div>