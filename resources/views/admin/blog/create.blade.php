{!! Form::open([
        'route' => ['admin.blog.store'],
        'id' => 'createPost'
    ]) !!}
	
    @include('admin/blog/form', ['published_at' => Carbon\Carbon::now()])
    
{!! Form::close() !!}