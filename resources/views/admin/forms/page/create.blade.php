{!! Form::open([
        'route' => ['admin.page.store'],
        'id' => 'createPage'
    ]) !!}
	
    @include('admin/forms/page/form')
    
{!! Form::close() !!}