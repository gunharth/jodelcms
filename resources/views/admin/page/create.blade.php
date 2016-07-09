{!! Form::open([
        'route' => ['admin.page.store'],
        'id' => 'createPage'
    ]) !!}
	
    @include('admin/page/form')
    
{!! Form::close() !!}