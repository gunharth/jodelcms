{!! Form::model($page,[
        'method' => 'PATCH',
        'route' => ['admin.page.update', $page->slug],
        'id' => 'updatePage'
    ]) !!}
	
    @include('admin/page/form')

{!! Form::close() !!}