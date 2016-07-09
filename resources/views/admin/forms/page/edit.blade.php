{!! Form::model($page,[
        'method' => 'PATCH',
        'route' => ['admin.page.update', $page->slug],
        'id' => 'updatePage'
    ]) !!}
	
    @include('admin/forms/page/form')

{!! Form::close() !!}