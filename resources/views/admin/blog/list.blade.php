<ol class="dd-list" id="collectionItems">
@foreach($posts as $post)
<li class="dd-item" data-collection="blog" data-id="{{ $post->id }}">
	<div class="dd-content" style="padding-left:5px; padding-right:5px;">
		<span class="dd-title" style="width: 120px">{{ $post->title }}</span>
		<div class="btn-group pull-right" role="group" aria-label="...">
			<button type="button" class="btn btn-link btn-xs load" data-toggle="tooltip" title="load in Browser"><i class="fa fa-external-link" data-url="{{ $post->link }}"></i></button>
			<button type="button" class="btn btn-link btn-xs edit" data-toggle="tooltip" title="edit"><i class="fa fa-gear"></i></button>
			{{-- <button type="button" class="btn btn-link btn-xs duplicate" data-toggle="tooltip" title="duplicate"><i class="fa fa-copy"></i></button> --}}
			<button type="button" class="btn btn-link btn-xs delete" data-toggle="tooltip" title="delete"><i class="fa fa-fw fa-times"></i></button>
	</div>
	</div>
</li>
@endforeach
</ol>

{!! $posts->links('admin.partials.pagination') !!}