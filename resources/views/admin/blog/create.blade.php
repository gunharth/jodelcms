{!! Form::open([
        'route' => ['admin.blog.store'],
        'id' => 'createPost'
    ]) !!}
	
    @include('admin/blog/form')
    
{!! Form::close() !!}